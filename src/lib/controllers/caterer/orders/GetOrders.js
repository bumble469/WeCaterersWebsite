import jwt from "jsonwebtoken";
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

export const getCatererOrders = async (token) => {
  if (!token) {
    return { status: 401, data: { error: 'Authorization token is required!' } };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.cateringid) {
      return { status: 401, data: { error: 'Invalid or expired token' } };
    }

    const cateringid = BigInt(decoded.cateringid);

    const rawOrders = await prisma.$queryRawUnsafe(`
      SELECT 
        o.orderid,
        o.status,
        o.total_price,
        o.notes,
        o.order_date,
        o.cateringid,
        u.fullname AS clientname, 
        u.address, 
        u.contact,
        u.email,
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
      LEFT JOIN users u ON o.userid = u.userid
      LEFT JOIN caterers c ON o.cateringid = c.cateringid
      LEFT JOIN order_items oi ON o.orderid = oi.orderid
      LEFT JOIN menu m ON oi.menuid = m.menuid
      LEFT JOIN services s ON oi.serviceid = s.serviceid
      WHERE o.cateringid = ${cateringid}
      ORDER BY o.order_date DESC;
    `);

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
    console.error('Error fetching caterer orders:', error);
    return { status: 500, data: { error: 'Internal server error' } };
  }
};
