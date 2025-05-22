import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma/client';

export const deleteServices = async (token, serviceid) => {
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

    const service = await prisma.service.findUnique({
      where: { serviceid },
    });

    if (!service || service.cateringid !== cateringid) {
      return { status: 404, data: { error: 'Service not found or unauthorized' } };
    }

    const deletedService = await prisma.service.delete({
      where: { serviceid },
    });

    return { status: 200, data: deletedService };
  } catch (err) {
    console.error('Error deleting service:', err);
    if (err.name === 'JsonWebTokenError') {
      return { status: 403, data: { error: 'Invalid token' } };
    }
    return { status: 500, data: { error: 'Server error' } };
  }
};
