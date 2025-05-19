import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const deleteCartItem = async (token, cartid, menuid, serviceid) => {
  if (!token) {
    return { status: 401, data: { error: 'Authorization token is required!' } };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return { status: 401, data: { error: 'Invalid or expired token' } };
    }
    const userid = parseInt(decoded.userid);

    const whereClause = {
      userid,
      cartid,
      ...(menuid ? { menuid } : {}),
      ...(serviceid ? { serviceid } : {})
    };

    const cartItem = await prisma.cart.findFirst({ where: whereClause });

    if (!cartItem) {
      return { status: 404, data: { error: "Cart item not found" } };
    }

    await prisma.cart.deleteMany({ where: whereClause });

    return {
      status: 200,
      data:{ message: "Item removed from cart!" },
    };

  } catch (err) {
    console.log("Error:", err.message);
    return { status: 500, data: { error: 'Server error: ' + err.message } };
  }
};

