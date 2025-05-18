import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getImageMimeType(buffer) {
  if (!buffer || buffer.length < 4) return null;

  const header = buffer.slice(0, 4).toString('hex').toUpperCase();

  if (header.startsWith('89504E47')) return 'image/png';
  if (header.startsWith('FFD8FF')) return 'image/jpeg';
  if (header.startsWith('47494638')) return 'image/gif';
  if (header.startsWith('424D')) return 'image/bmp';

  return 'application/octet-stream';
}

export const getCatererOverview = async (token) => {
  if (!token) {
    return { status: 401, data: { error: 'Authorization token is required!' } };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const caterer = await prisma.caterer.findUnique({
      where: {
        cateringid: parseInt(decoded.cateringid),
      },
      select: {
        cateringid: true,
        cateringname: true,
        description: true,
        cateringimage: true,
      },
    });

    if (!caterer) {
      return { status: 404, data: { error: 'Caterer not found!' } };
    }

    const toBuffer = (data) => {
      if (!data) return null;
      if (Buffer.isBuffer(data)) return data;
      if (Array.isArray(data)) return Buffer.from(data);
      if (typeof data === 'string' && data.includes(',')) {
        const arr = data.split(',').map(s => Number(s.trim()));
        return Buffer.from(arr);
      }
      return Buffer.from(data);
    };

    const cateringImageBuffer = toBuffer(caterer.cateringimage);

    const cateringimageBase64 = cateringImageBuffer
      ? `data:${getImageMimeType(cateringImageBuffer)};base64,${cateringImageBuffer.toString('base64')}`
      : null;

    const serviceCount = await prisma.service.count({
      where: {
        cateringid: parseInt(decoded.cateringid),
      },
    });

    const menuItemCount = await prisma.menu.count({
      where: {
        cateringid: parseInt(decoded.cateringid),
      },
    });

    return {
      status: 200,
      data: {
        cateringid: caterer.cateringid.toString(),
        cateringname: caterer.cateringname,
        description: caterer.description,
        cateringimage: cateringimageBase64,
        serviceCount,
        menuItemCount,
      },
    };

  } catch (err) {
    console.error('Token verification failed:', err.message);
    return { status: 403, data: { error: 'Invalid or expired token!' } };
  }
};
