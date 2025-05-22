import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma/client';

function getImageMimeType(buffer) {
  if (!buffer || buffer.length < 4) return null;

  const header = buffer.slice(0, 4).toString('hex').toUpperCase();

  if (header.startsWith('89504E47')) return 'image/png';       
  if (header.startsWith('FFD8FFDB') || header.startsWith('FFD8FFE0') || header.startsWith('FFD8FFE1')) return 'image/jpeg';  // JPEG
  if (header.startsWith('47494638')) return 'image/gif';       
  if (header.startsWith('424D')) return 'image/bmp';           

  return 'application/octet-stream';
}

export const getMenu = async (token) => {
  if (!token) {
    return { status: 401, data: { error: 'Authorization token is required!' } };
  }

  try {
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);

    const cateringid = parseInt(decoded.cateringid);
    if (!cateringid) {
      return { status: 403, data: { error: 'Invalid token: cateringid missing' } };
    }

    const menu = await prisma.menu.findMany({
      where: { cateringid: cateringid, isdeleted: false },
    });

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

    return {
      status: 200,
      data: menu.map(menu => {
        const menuItemBuffer = toBuffer(menu.image_data);
        const menuImageBase64 = menuItemBuffer
          ? `data:${getImageMimeType(menuItemBuffer)};base64,${menuItemBuffer.toString('base64')}`
          : null;

        return {
          ...menu,
          menuid: menu.menuid.toString(),
          cateringid: menu.cateringid.toString(),
          image_data: menuImageBase64,
        };
      }),
    };

  } catch (err) {
    console.error('Error fetching services:', err);
    if (err.name === 'JsonWebTokenError') {
      return { status: 403, data: { error: 'Invalid token' } };
    }
    return { status: 500, data: { error: 'Server error' } };
  }
};

