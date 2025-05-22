import jwt from "jsonwebtoken";
import prisma from '@/lib/prisma/client';

export const getUserOrders = async (token) => {
  if (!token) {
    return { status: 401, data: { error: 'Authorization token is required!' } };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userid) {
      return { status: 401, data: { error: 'Invalid or expired token' } };
    }

    const userid = BigInt(decoded.userid);

    const rawOrders = await prisma.$queryRawUnsafe(`
      SELECT 
        o.orderid,
        o.status,
        o.total_price,
        o.notes,
        o.order_date,
        o.cateringid,
        c.cateringname,
        oi.itemid,
        oi.menuid,
        m.name AS menuname,
        m.price AS menuprice,
        oi.serviceid,
        s.name AS servicename,
        s.price AS serviceprice,
        oi.quantity
      FROM orders o
      LEFT JOIN caterers c ON o.cateringid = c.cateringid
      LEFT JOIN order_items oi ON o.orderid = oi.orderid
      LEFT JOIN menu m ON oi.menuid = m.menuid
      LEFT JOIN services s ON oi.serviceid = s.serviceid
      WHERE o.userid = ${userid}
      ORDER BY o.order_date DESC;
    `);

    // Convert BigInt to Number or string
    const orders = rawOrders.map(order => {
      const converted = {};
      for (const key in order) {
        const value = order[key];
        converted[key] = typeof value === 'bigint' ? Number(value) : value;
      }
      return converted;
    });

    return { status: 200, data: orders };

  } catch (error) {
    console.error('Error fetching user orders:', error);
    return { status: 500, data: { error: 'Internal server error' } };
  }
};
