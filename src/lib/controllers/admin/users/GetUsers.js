import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAdminUsers = async (token) => {
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
        u.userid,
        u.fullname,
        u.email,
        COUNT(o.orderid) AS totalOrders,
        SUM(CASE WHEN o.status IN ('Confirmed', 'Cancellation Rejected') THEN 1 ELSE 0 END) AS confirmedOrders,
        SUM(CASE WHEN o.status = 'Delivered' THEN 1 ELSE 0 END) AS deliveredOrders,
        SUM(CASE WHEN o.status = 'Cancelled' THEN 1 ELSE 0 END) AS cancelledOrders
      FROM users u
      LEFT JOIN orders o ON u.userid = o.userid
      GROUP BY u.userid, u.fullname, u.email
      ORDER BY u.fullname;
    `;

    const rawResults = await prisma.$queryRawUnsafe(query);

    const usersWithOrderStats = rawResults.map(user => {
      const convertedUser = {};
      for (const key in user) {
        const value = user[key];
        convertedUser[key] = typeof value === 'bigint'
          ? (value <= Number.MAX_SAFE_INTEGER ? Number(value) : value.toString())
          : value;
      }
      return convertedUser;
    });


    return {
      status: 200,
      data: usersWithOrderStats,
    };

  } catch (err) {
    console.error('Token verification or DB error:', err.message);
    return { status: 403, data: { error: 'Invalid or expired token or query error!' } };
  }
};
