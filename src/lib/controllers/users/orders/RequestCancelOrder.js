import jwt from "jsonwebtoken";
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

export const requestCancelOrders = async (token, orderid) => {
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

    await prisma.orders.update({
      where: { orderid: BigInt(id) },
      data: { status: "Requested Cancel" },
    });

    return { status: 200, data: { message: 'Order cancellation requested successfully' } };

  } catch (error) {
    console.error('Error requesting order cancellation:', error);
    return { status: 500, data: { error: 'Internal server error' } };
  }
};
