import jwt from "jsonwebtoken";
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

export const deleteUserOrders = async (token, orderid) => {
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
      where: { orderid: id },
    });

    if (!existingOrder || existingOrder.userid !== userid) {
      return { status: 403, data: { error: 'Unauthorized or order not found' } };
    }

    await prisma.order_items.deleteMany({
      where: { orderid: id },
    });

    await prisma.orders.delete({
      where: { orderid: id },
    });

    return { status: 200, data: { message: 'Order deleted successfully' } };

  } catch (error) {
    console.error('Error deleting user order:', error);
    return { status: 500, data: { error: 'Internal server error' } };
  }
};
