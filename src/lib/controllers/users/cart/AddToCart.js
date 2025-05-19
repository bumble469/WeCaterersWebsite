  import jwt from "jsonwebtoken";
  import { PrismaClient } from "@prisma/client";

  const prisma = new PrismaClient();

export const addToCart = async (token, cateringid, menuid, serviceid, quantity) => {
  if (!token) {
    return { status: 401, data: { error: 'Authorization token is required!' } };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userid = parseInt(decoded.userid);
    if (!decoded || !userid) {
      return { status: 401, data: { error: 'Invalid or expired token' } };
    }

    const hasMenuId = !!menuid;
    const hasServiceId = !!serviceid;

    if ((hasMenuId && hasServiceId) || (!hasMenuId && !hasServiceId)) {
      return {
        status: 400,
        data: { error: "Provide either menuid or serviceid, not both or neither." }
      };
    }

    const existingCartItem = await prisma.cart.findFirst({
      where: {
        userid: BigInt(userid),
        cateringid: BigInt(cateringid),
        ...(hasMenuId ? { menuid: BigInt(menuid) } : {}),
        ...(hasServiceId ? { serviceid: BigInt(serviceid) } : {}),
      },
    });

    if (existingCartItem) {
      return {
        status: 409,
        data: { error: "Item already in cart!" },
      };
    }

    const newCartItem = await prisma.cart.create({
      data: {
        userid: BigInt(userid),
        cateringid: BigInt(cateringid),
        menuid: hasMenuId ? BigInt(menuid) : null,
        serviceid: hasServiceId ? BigInt(serviceid) : null,
        quantity,
      }
    });

    
  return {
    status: 200,
    data: { message: "Item added to cart!" },
  };

  } catch (err) {
    console.error("Error:", err.message);
    return { status: 500, data: { error: 'Server error: ' + err.message } };
  }
};
