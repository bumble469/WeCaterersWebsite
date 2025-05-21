import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAdminOverview = async (token) => {
  if (!token) {
    return { status: 401, data: { error: 'Authorization token is required!' } };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.adminid) {
      return { status: 403, data: { error: 'Access denied. Admins only.' } };
    }

    const totalUsers = await prisma.user.count();

    const totalCaterers = await prisma.caterer.count();

    const totalOrders = await prisma.orders.count();
    const confirmedOrders = await prisma.orders.count({
      where: { status: { in: ['Confirmed', 'Cancellation Rejected'] } },
    });
    const deliveredOrders = await prisma.orders.count({ where: { status: 'Delivered' } });
    const cancelledOrders = await prisma.orders.count({ where: { status: 'Cancelled' } });

    const deliveredOrderIds = await prisma.orders.findMany({
      where: { status: 'Delivered' },
      select: { orderid: true },
    });

    const orderIds = deliveredOrderIds.map(o => o.orderid);

    const distinctServiceIds = await prisma.order_items.findMany({
      where: {
        orderid: { in: orderIds },
        serviceid: { not: null },
      },
      distinct: ['serviceid'],
      select: { serviceid: true },
    });

    const servicesDelivered = distinctServiceIds.length;

    return {
      status: 200,
      data: {
        totalUsers,
        totalCaterers,
        ordersReceived: totalOrders,
        confirmedOrders,
        deliveredOrders,
        cancelledOrders,
        servicesDelivered,
      },
    };

  } catch (err) {
    console.error('Token verification or DB error:', err.message);
    return { status: 403, data: { error: 'Invalid or expired token or query error!' } };
  }
};
