import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const editMenu = async (
  token,
  menuid,
  name,
  description,
  price,
  cuisinetype,
  dietarypreference,
  image // base64 string expected here
) => {
  if (!token) {
    return { status: 401, data: { error: 'Authorization token is required!' } };
  }

  try {
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);
    const cateringid = parseInt(decoded.cateringid);

    if (!cateringid) {
      return { status: 403, data: { error: 'Invalid token: cateringid missing' } };
    }

    const menuId = parseInt(menuid);

    const menu = await prisma.menu.findUnique({
      where: { menuid: menuId },
    });

    if (!menu || parseInt(menu.cateringid) !== cateringid) {
      return { status: 404, data: { error: 'Menu not found or unauthorized' } };
    }

    // Prepare update data object only with defined values
    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (cuisinetype !== undefined) updateData.cuisinetype = cuisinetype;
    if (dietarypreference !== undefined) updateData.dietarypreference = dietarypreference;

    if (image !== undefined && image !== null) {
      const base64Data = image.includes('base64,') ? image.split('base64,')[1] : image;
      updateData.image_data = Buffer.from(base64Data, 'base64'); // updated field name
    }

    if (Object.keys(updateData).length === 0) {
      return { status: 400, data: { error: 'No valid fields to update' } };
    }

    await prisma.menu.update({
      where: { menuid: menuId },
      data: updateData,
    });

    return { status: 200, message: "Menu item updated!" };
  } catch (err) {
    console.error('Error updating menu:', err);
    if (err.name === 'JsonWebTokenError') {
      return { status: 403, data: { error: 'Invalid token' } };
    }
    return { status: 500, data: { error: 'Server error' } };
  }
};
