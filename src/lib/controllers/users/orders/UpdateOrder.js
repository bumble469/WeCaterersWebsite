import jwt from "jsonwebtoken";
import prisma from '@/lib/prisma/client';

export const updateOrderStatus = async (token, orderid, newStatus) => {
  if (!token) {
    return { status: 401, data: { error: 'Authorization token is required!' } };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userid) {
      return { status: 401, data: { error: 'Invalid or expired token' } };
    }

    const userid = BigInt(decoded.userid);
    const id = parseInt(orderid);

    const existingOrder = await prisma.orders.findUnique({
      where: { orderid: BigInt(id) },
    });

    if (!existingOrder || existingOrder.userid !== userid) {
      return { status: 403, data: { error: 'Unauthorized or order not found' } };
    }

    if (!["Requested Cancel", "Delivered"].includes(newStatus)) {
      return { status: 400, data: { error: 'Invalid status update' } };
    }

    await prisma.orders.update({
      where: { orderid: BigInt(id) },
      data: { status: newStatus },
    });

    return { status: 200, data: { message: `Order marked as ${newStatus}` } };

  } catch (error) {
    console.error('Error updating order status:', error);
    return { status: 500, data: { error: 'Internal server error' } };
  }
};
