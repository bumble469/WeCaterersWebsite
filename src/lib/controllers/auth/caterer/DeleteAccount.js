import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export const deleteCaterer = async (token) => {
  if (!token) {
    return { status: 401, data: { error: 'Token is required!' } };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const cateringId = decoded.cateringid;
    if (!cateringId) {
      return { status: 400, data: { error: 'Invalid token!' } };
    }

    const caterer = await prisma.caterer.findUnique({
      where: { cateringid: BigInt(cateringId) },
    });

    if (!caterer) {
      return { status: 404, data: { error: 'Caterer not found!' } };
    }

    await prisma.caterer.delete({
      where: { cateringid: BigInt(cateringId) },
    });

    await prisma.refresh_tokens.deleteMany({
      where: { catererid: BigInt(cateringId) },
    });

    return { status: 200, data: { message: 'Caterer account deleted successfully.' } };
  } catch (err) {
    console.error('Delete error:', err.message);
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return { status: 401, data: { error: 'Invalid or expired token!' } };
    }
    return { status: 500, data: { error: 'Internal server error!' } };
  }
};
