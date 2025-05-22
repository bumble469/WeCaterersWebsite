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

export const getCatererMenu = async (token, cateringid) => {
  if (!token) {
    return { status: 401, data: { error: 'Authorization token is required!' } };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return { status: 401, data: { error: 'Invalid or expired token' } };
    }

    const menu = await prisma.menu.findMany({
        where:{
            cateringid:parseInt(cateringid)
        },
        select: {
            menuid: true,
            cateringid: true,
            name: true,
            description: true,
            price: true,
            rating: true,
            cuisinetype: true,
            dietarypreference: true,
            image_data: true
        }
    });

    const formattedMenu = menu.map((m) => {
        const menuImageBuffer = toBuffer(m.image_data);
        const menuImageBase64 = menuImageBuffer ? `data:${getImageMimeType(menuImageBuffer)};base64,${ menuImageBuffer.toString('base64')}`: null;

        return {
        ...m,
        cateringid: m.cateringid.toString(),
        menuid: m.menuid.toString(),
        image_data: menuImageBase64,
      };
    })

    return {
      status: 200,
      formattedMenu,
    };

  } catch (err) {
    console.log("Error:", err.message);
    return { status: 500, data: { error: 'Server error: ' + err.message } };
  }
};
