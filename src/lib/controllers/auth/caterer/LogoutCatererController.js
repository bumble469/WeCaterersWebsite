import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const logoutCaterer = async (token) => {
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

    const caterer = await prisma.caterer.findUnique({ where: { cateringid } });
    if (!caterer) {
      return { status: 404, data: { error: 'Caterer not found' } };
    }
    await prisma.refresh_tokens.deleteMany({
      where: {
        catererid: cateringid,
      },
    });
    return { status: 200, data: { message: 'Logout successful' } };
  } catch (err) {
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
      return { status: 403, data: { error: 'Invalid or expired token!' } };
    }
    console.error('Logout error:', err.message);
    return { status: 500, data: { error: 'Internal server error!' } };
  }
};
