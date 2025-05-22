import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma/client';

export const getAdminCaterers = async (token) => {
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
        c.cateringid,
        c.cateringname,
        c.email,
        c.ownername,
        c.contact,
        c.address,
        c.description,
        c.eventtype,
        c.pricerange,
        c.rating AS overallRating,

        -- Order metrics
        COUNT(DISTINCT o.orderid) AS totalOrders,
        SUM(CASE WHEN o.status IN ('Confirmed', 'Cancellation Rejected') THEN 1 ELSE 0 END) AS confirmedOrders,
        SUM(CASE WHEN o.status = 'Delivered' THEN 1 ELSE 0 END) AS deliveredOrders,
        SUM(CASE WHEN o.status = 'Cancelled' THEN 1 ELSE 0 END) AS cancelledOrders,
        MAX(o.order_date) AS latestOrderDate,

        -- Menu metrics
        (SELECT COUNT(*) FROM menu m WHERE m.cateringid = c.cateringid) AS totalMenuItems,
        (SELECT AVG(m.rating) FROM menu m WHERE m.cateringid = c.cateringid) AS averageMenuRating,

        -- Service metrics
        (SELECT COUNT(*) FROM services s WHERE s.cateringid = c.cateringid) AS totalServices,
        (SELECT COUNT(*) FROM services s WHERE s.cateringid = c.cateringid AND s.availability = true) AS availableServices,

        -- Rating metrics
        (SELECT COUNT(*) FROM caterer_ratings r WHERE r.cateringid = c.cateringid) AS numberOfRatings,
        (SELECT AVG(r.rating) FROM caterer_ratings r WHERE r.cateringid = c.cateringid) AS averageUserRating,

        -- Menu items delivered count
        (
            SELECT COALESCE(SUM(oi.quantity), 0)
            FROM orders o2
            JOIN order_items oi ON o2.orderid = oi.orderid
            JOIN menu m ON m.menuid = oi.menuid
            WHERE o2.status = 'Delivered' AND m.cateringid = c.cateringid
        ) AS totalMenuItemsDelivered

    FROM caterers c
    LEFT JOIN orders o ON c.cateringid = o.cateringid
    GROUP BY 
        c.cateringid, c.cateringname, c.email, c.ownername, 
        c.contact, c.address, c.description, c.eventtype, 
        c.pricerange, c.rating
    ORDER BY c.cateringname;
    `;

    const rawResults = await prisma.$queryRawUnsafe(query);

    const caterersWithOrderStats = rawResults.map(caterer => {
      const converted = {};
      for (const key in caterer) {
        const value = caterer[key];
        converted[key] = typeof value === 'bigint'
          ? (value <= Number.MAX_SAFE_INTEGER ? Number(value) : value.toString())
          : value;
      }
      return converted;
    });

    return {
      status: 200,
      data: caterersWithOrderStats,
    };

  } catch (err) {
    console.error('Token verification or DB error:', err.message);
    return { status: 403, data: { error: 'Invalid or expired token or query error!' } };
  }
};
