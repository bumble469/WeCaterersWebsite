import prisma from '@/lib/prisma/client';
import jwt from "jsonwebtoken";

export const createOrderFromCart = async (token, cateringid, status, notes = null, total_price) => {
  if (!token) {
    return { status: 401, data: { error: 'Authorization token is required!' } };
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userid) {
      return { status: 401, data: { error: 'Invalid or expired token' } };
    }
    const userid = decoded.userid;

    const cartItems = await prisma.cart.findMany({
      where: { userid: BigInt(userid), cateringid: BigInt(cateringid) }
    });

    if (cartItems.length == 0) {
      return { status: 400, data: { error: 'Cart is empty' } };
    }

    const order = await prisma.orders.create({
      data: {
        userid: BigInt(userid),
        cateringid: BigInt(cateringid),
        total_price,
        status,
        notes,
      }
    });

    const orderItemsData = cartItems.map(item => ({
      orderid: order.orderid,
      menuid: item.menuid ? BigInt(item.menuid) : null,
      serviceid: item.serviceid ? BigInt(item.serviceid) : null,
      quantity: item.quantity,
    }));

    const orderCreated = await prisma.order_items.createMany({
      data: orderItemsData
    });

    if (orderCreated.count > 0) {
      await prisma.cart.deleteMany({
        where: {
          userid: BigInt(userid),
          cateringid: BigInt(cateringid)
        }
      });
    }

    return { status: 200, data: { orderid: parseInt(order.orderid), message: 'Order created successfully' } };

  } catch (error) {
    console.error('Error creating order:', error);
    return { status: 500, data: { error: 'Internal server error' } };
  }
};
