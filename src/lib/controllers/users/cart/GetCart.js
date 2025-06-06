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

export const getCart = async (token) => {
  if (!token) {
    return { status: 401, data: { error: 'Authorization token is required!' } };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userid = parseInt(decoded.userid);

    if (!decoded || !userid) {
      return { status: 401, data: { error: 'Invalid or expired token' } };
    }

    const cartItems = await prisma.$queryRaw`
    SELECT
        c.cartid,
        c.cateringid AS cateringid,
        cat.cateringname AS cateringname,          
        c.userid,
        c.quantity,
        c.menuid,
        c.serviceid,
        m.name AS menu_name,
        m.price AS menu_price,
        m.rating AS menu_rating,
        m.cuisinetype,
        m.dietarypreference,
        m.image_data,
        s.name AS service_name,
        s.description AS service_description,
        s.price AS service_price,
        s.capacity AS service_capacity
    FROM cart c
    LEFT JOIN menu m ON c.menuid = m.menuid AND c.cateringid = m.cateringid
    LEFT JOIN services s ON c.serviceid = s.serviceid AND c.cateringid = s.cateringid
    LEFT JOIN caterers cat ON c.cateringid = cat.cateringid   -- Added this join
    WHERE c.userid = ${BigInt(userid)}
    `;


    // Format and convert BigInt fields, also convert image_data to base64 string
    const formattedCartItems = cartItems.map(item => {
      let imageDataUri = null;

      if (item.image_data) {
        const buffer = toBuffer(item.image_data);
        const mimeType = getImageMimeType(buffer) || 'application/octet-stream';
        const base64 = buffer.toString('base64');
        imageDataUri = `data:${mimeType};base64,${base64}`;
      }

      return {
        ...item,
        cartid:Number(item.cartid),
        cateringid: Number(item.cateringid),
        userid: Number(item.userid),
        menuid: item.menuid !== null ? Number(item.menuid) : null,
        serviceid: item.serviceid !== null ? Number(item.serviceid) : null,
        image_data: imageDataUri, // Replace buffer with base64 data URI or null
      };
    });

    return {
      status: 200,
      data: formattedCartItems,
    };
  } catch (err) {
    console.error("Error fetching cart:", err.message);
    return { status: 500, data: { error: 'Server error: ' + err.message } };
  }
};
