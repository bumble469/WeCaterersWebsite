import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getImageMimeType(buffer) {
  if (!buffer || buffer.length < 4) return null;

  const header = buffer.slice(0, 4).toString('hex').toUpperCase();

  if (header.startsWith('89504E47')) return 'image/png';       
  if (header.startsWith('FFD8FFDB') || header.startsWith('FFD8FFE0') || header.startsWith('FFD8FFE1')) return 'image/jpeg';  // JPEG
  if (header.startsWith('47494638')) return 'image/gif';       
  if (header.startsWith('424D')) return 'image/bmp';           

  return 'application/octet-stream';
}

export const getCatererProfile = async (token) => {
  if (!token) {
    return { status: 401, data: { error: 'Authorization token is required!' } };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const caterer = await prisma.caterer.findUnique({
      where: {
        cateringid: BigInt(decoded.cateringid),
      },
      select: {
        cateringid: true,
        cateringname: true,
        ownername: true,
        email: true,
        contact: true,
        address: true,
        description: true,
        cateringimage: true,
        cateringbannerimage: true,
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
    const cateringBannerImageBuffer = toBuffer(caterer.cateringbannerimage);

    const cateringimageBase64 = cateringImageBuffer
      ? `data:${getImageMimeType(cateringImageBuffer)};base64,${cateringImageBuffer.toString('base64')}`
      : null;

    const cateringbannerimageBase64 = cateringBannerImageBuffer
      ? `data:${getImageMimeType(cateringBannerImageBuffer)};base64,${cateringBannerImageBuffer.toString('base64')}`
      : null;

    return {
      status: 200,
      data: {
        ...caterer,
        cateringid: caterer.cateringid.toString(),
        cateringimage: cateringimageBase64,
        cateringbannerimage: cateringbannerimageBase64,
      },
    };

  } catch (err) {
    console.error('Token verification failed:', err.message);
    return { status: 403, data: { error: 'Invalid or expired token!' } };
  }
};