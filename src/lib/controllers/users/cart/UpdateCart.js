import prisma from '@/lib/prisma/client';
import jwt from 'jsonwebtoken';

export const updateCartItem = async (token, cartid, menuid, quantity) => {
  if (!token) {
    return { status: 401, data: { error: 'Authorization token is required!' } };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return { status: 401, data: { error: 'Invalid or expired token' } };
    }

    const userid = parseInt(decoded.userid);

    const cartItem = await prisma.cart.findFirst({
      where: {
        userid,
        cartid,
        menuid
      }
    });

    if (!cartItem) {
      return { status: 404, data: { error: "Cart item not found" } };
    }

    const updatedItem = await prisma.cart.update({
        where: {
            cartid: cartItem.cartid 
        },
        data: {
            quantity
        }
    });

    return {
      status: 200,
      data: { message: "Item updated!", updatedItem }
    };

  } catch (err) {
    console.error("Error:", err.message);
    return { status: 500, data: { error: 'Server error: ' + err.message } };
  }
};
