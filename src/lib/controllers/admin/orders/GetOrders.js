import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAdminOrders = async (token) => {
  if (!token) {
    return { status: 401, data: { error: 'Authorization token is required!' } };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.adminid) {
      return { status: 403, data: { error: 'Access denied. Admins only.' } };
    }

    const query = `
      SELECT 
        o.orderid,
        o.userid,
        u.fullname AS username,
        o.cateringid,
        c.cateringname,
        o.total_price,
        o.status,
        o.notes,
        o.order_date,
        COALESCE(json_agg(
        json_build_object(
            'itemid', oi.itemid,
            'quantity', oi.quantity,
            'name', COALESCE(m.name, s.name),
            'price', COALESCE(m.price, s.price)
        )
        ) FILTER (WHERE oi.itemid IS NOT NULL), '[]') AS items
    FROM orders o
    JOIN users u ON o.userid = u.userid
    JOIN caterers c ON o.cateringid = c.cateringid
    LEFT JOIN order_items oi ON o.orderid = oi.orderid
    LEFT JOIN menu m ON oi.menuid = m.menuid
    LEFT JOIN services s ON oi.serviceid = s.serviceid
    GROUP BY o.orderid, u.fullname, c.cateringname
    ORDER BY o.order_date DESC;

    `;

    const rawResults = await prisma.$queryRawUnsafe(query);

    const serializedResults = rawResults.map(order => {
      const converted = {};
      for (const key in order) {
        const value = order[key];
        converted[key] = typeof value === 'bigint'
          ? (value <= Number.MAX_SAFE_INTEGER ? Number(value) : value.toString())
          : value;
      }
      return converted;
    });

    return {
      status: 200,
      data: serializedResults,
    };

  } catch (err) {
    console.error('Token verification or DB error:', err.message);
    return { status: 403, data: { error: 'Invalid or expired token or query error!' } };
  }
};
