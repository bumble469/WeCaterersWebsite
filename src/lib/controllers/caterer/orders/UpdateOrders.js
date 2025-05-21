import jwt from "jsonwebtoken";
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

export const updateCatererOrders = async (token, orderid, status) => {
  if (!token) {
    return { status: 401, data: { error: 'Authorization token is required!' } };
  }

  if (!orderid || !status) {
    return { status: 400, data: { error: 'Order ID and status are required!' } };
  }

  const allowedStatuses = ['Confirmed', 'Cancelled_C', 'Rejected', 'Cancelled', "Cancel Accepted", "Cancellation Rejected", "Out for delivery"];
  if (!allowedStatuses.includes(status)) {
    return { status: 400, data: { error: 'Invalid status value!' } };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.cateringid) {
      return { status: 401, data: { error: 'Invalid or expired token' } };
    }

    const cateringid = BigInt(decoded.cateringid);

    const updatedOrder = await prisma.orders.updateMany({
      where: {
        orderid: BigInt(orderid),
        cateringid: cateringid,
      },
      data: {
        status: status,
      },
    });

    if (updatedOrder.count === 0) {
      return { status: 404, data: { error: 'Order not found or unauthorized' } };
    }

    return { status: 200, data: { message: 'Order status updated successfully' } };

  } catch (error) {
    console.error('Error updating caterer orders:', error);
    return { status: 500, data: { error: 'Internal server error' } };
  }
};
