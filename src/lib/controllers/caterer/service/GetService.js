import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma/client';

export const getServices = async (token) => {
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

    const services = await prisma.service.findMany({
      where: { cateringid: cateringid, isdeleted: false },
    });

    return { status: 200, data: services };
  } catch (err) {
    console.error('Error fetching services:', err);
    if (err.name === 'JsonWebTokenError') {
      return { status: 403, data: { error: 'Invalid token' } };
    }
    return { status: 500, data: { error: 'Server error' } };
  }
};
