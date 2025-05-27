import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export const deleteUser = async (token) => {
  if (!token) {
    return { status: 401, data: { error: 'Token is required!' } };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userid;
    if (!userId) {
      return { status: 400, data: { error: 'Invalid token!' } };
    }

    const user = await prisma.user.findUnique({
      where: { userid: BigInt(userId) },
    });

    if (!user) {
      return { status: 404, data: { error: 'User not found!' } };
    }

    await prisma.user.delete({
      where: { userid: BigInt(userId) },
    });

    await prisma.refresh_tokens.deleteMany({
      where: { userid: BigInt(userId) },
    });

    return { status: 200, data: { message: 'User account deleted successfully.' } };
  } catch (err) {
    console.error('Delete error:', err.message);
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return { status: 401, data: { error: 'Invalid or expired token!' } };
    }
    return { status: 500, data: { error: 'Internal server error!' } };
  }
};
