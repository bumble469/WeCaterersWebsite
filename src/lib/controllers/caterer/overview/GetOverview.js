import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma/client';

function getImageMimeType(buffer) {
  if (!buffer || buffer.length < 4) return null;

  const header = buffer.slice(0, 4).toString('hex').toUpperCase();

  if (header.startsWith('89504E47')) return 'image/png';
  if (header.startsWith('FFD8FF')) return 'image/jpeg';
  if (header.startsWith('47494638')) return 'image/gif';
  if (header.startsWith('424D')) return 'image/bmp';

  return 'application/octet-stream';
}

export const getCatererOverview = async (token) => {
  if (!token) {
    return { status: 401, data: { error: 'Authorization token is required!' } };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const cateringid = parseInt(decoded.cateringid);

    const caterer = await prisma.caterer.findUnique({
      where: { cateringid },
      select: {
        cateringid: true,
        cateringname: true,
        description: true,
        cateringimage: true,
        rating: true,
      },
    });

    if (!caterer) {
      return { status: 404, data: { error: 'Caterer not found!' } };
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

    const cateringImageBuffer = toBuffer(caterer.cateringimage);

    const cateringimageBase64 = cateringImageBuffer
      ? `data:${getImageMimeType(cateringImageBuffer)};base64,${cateringImageBuffer.toString('base64')}`
      : null;

    // Counts for services and menus
    const serviceCount = await prisma.service.count({
      where: { cateringid },
    });

    const menuItemCount = await prisma.menu.count({
      where: { cateringid },
    });

    // Order status counts using aggregate with filters
    const orderStatusCounts = await prisma.orders.aggregate({
      _count: {
        _all: true,
        status: true, // Prisma doesn’t allow counting by status directly, so use _count + filter
      },
      where: { cateringid },
    });

    // Because Prisma doesn't support conditional counts in aggregate,
    // we do separate counts for each status:

    const totalOrders = await prisma.orders.count({ where: { cateringid } });
    const confirmedOrders = await prisma.orders.count({ where: { cateringid, status: {in: ['Confirmed', 'Cancellation Rejected']} } });
    const deliveredOrders = await prisma.orders.count({ where: { cateringid, status: 'Delivered' } });
    const cancelledOrders = await prisma.orders.count({ where: { cateringid, status: 'Cancelled' } });

    // Count distinct services delivered:
    // Get all order_items where order status is 'Delivered' and cateringid matches,
    // then get distinct serviceids count in JS

    const deliveredOrderIds = await prisma.orders.findMany({
      where: { cateringid, status: 'Delivered' },
      select: { orderid: true },
    });

    const orderIds = deliveredOrderIds.map(o => o.orderid);

    const distinctServiceIds = await prisma.order_items.findMany({
      where: {
        orderid: { in: orderIds },
        serviceid: { not: null },
      },
      distinct: ['serviceid'],
      select: {
        serviceid: true,
      },
    });

    const servicesDelivered = distinctServiceIds.length;

    return {
      status: 200,
      data: {
        cateringid: caterer.cateringid.toString(),
        cateringname: caterer.cateringname,
        description: caterer.description,
        cateringimage: cateringimageBase64,
        rating: caterer.rating,
        serviceCount,
        menuItemCount,
        ordersReceived: totalOrders,
        confirmedOrders,
        deliveredOrders,
        cancelledOrders,
        servicesDelivered,
      },
    };

  } catch (err) {
    console.error('Token verification failed or query error:', err.message);
    return { status: 403, data: { error: 'Invalid or expired token or query error!' } };
  }
};
