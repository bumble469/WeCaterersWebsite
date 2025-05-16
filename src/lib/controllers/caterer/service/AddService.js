import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addService = async (token, name, description, price, capacity) => {
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

    if (!name || !price || !capacity) {
      return { status: 400, data: { error: 'Name, price, and capacity are required' } };
    }
    const newService = await prisma.service.create({
      data: {
        cateringid,
        name,
        description: description || '',
        price: Number(price),
        capacity: Number(capacity),
      },
    });

    return { status: 200, message: 'Service added successfully', data: newService };
  } catch (err) {
    console.error('Error adding service:', err);
    if (err.name === 'JsonWebTokenError') {
      return { status: 403, data: { error: 'Invalid token' } };
    }
    return { status: 500, data: { error: 'Server error' } };
  }
};
