import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma/client';

export const deleteMenu = async (token, menuid) => {
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
      where: { menuid:menuId },
    });
    
    if (!menu || parseInt(menu.cateringid) !== cateringid) {
      return { status: 404, data: { error: 'Menu item not found or unauthorized' } };
    }

    const deletedMenu = await prisma.menu.delete({
      where: { menuid:menuId },
    });

    return { status: 200, message:"Menu item deleted successfully!"};
  } catch (err) {
    console.error('Error deleting service:', err);
    if (err.name === 'JsonWebTokenError') {
      return { status: 403, data: { error: 'Invalid token' } };
    }
    return { status: 500, data: { error: 'Server error' } };
  }
};
