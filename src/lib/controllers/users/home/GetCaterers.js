import jwt from "jsonwebtoken";
import prisma from '@/lib/prisma/client';

function getImageMimeType(buffer) {
  if (!buffer || buffer.length < 4) return null;

  const header = buffer.slice(0, 4).toString('hex').toUpperCase();

  if (header.startsWith('89504E47')) return 'image/png';
  if (
    header.startsWith('FFD8FFDB') ||
    header.startsWith('FFD8FFE0') ||
    header.startsWith('FFD8FFE1')
  ) return 'image/jpeg';
  if (header.startsWith('47494638')) return 'image/gif';
  if (header.startsWith('424D')) return 'image/bmp';

  return 'application/octet-stream';
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

export const getCaterers = async (token) => {
  if (!token) {
    return { status: 401, data: { error: 'Authorization token is required!' } };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return { status: 401, data: { error: 'Invalid or expired token' } };
    }

    const caterers = await prisma.caterer.findMany({
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
        eventtype: true,
        rating: true,
        pricerange: true,
      },
    });

    const formattedCaterers = caterers.map(caterer => {
      const cateringImageBuffer = toBuffer(caterer.cateringimage);
      const cateringBannerImageBuffer = toBuffer(caterer.cateringbannerimage);

      const cateringimageBase64 = cateringImageBuffer
        ? `data:${getImageMimeType(cateringImageBuffer)};base64,${cateringImageBuffer.toString('base64')}`
        : null;

      const cateringbannerimageBase64 = cateringBannerImageBuffer
        ? `data:${getImageMimeType(cateringBannerImageBuffer)};base64,${cateringBannerImageBuffer.toString('base64')}`
        : null;

      return {
        ...caterer,
        cateringid: parseInt(caterer.cateringid),
        cateringimage: cateringimageBase64,
        cateringbannerimage: cateringbannerimageBase64,
      };
    });

    return {
      status: 200,
      data: formattedCaterers,
    };

  } catch (err) {
    console.log("Error:", err.message);
    return { status: 500, data: { error: 'Server error: ' + err.message } };
  }
};
