import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const logoutUser = async (token) => {
  if (!token) {
    return { status: 401, data: { error: 'Authorization token is required!' } };
  }

  try {
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);

    const userid = parseInt(decoded.userid);
    if (!userid) {
      return { status: 403, data: { error: 'Invalid token: userid missing' } };
    }

    const user = await prisma.user.findUnique({ where: { userid } });
    if (!user) {
      return { status: 404, data: { error: 'User not found' } };
    }
    
    await prisma.refresh_tokens.deleteMany({
      where: {
        userid: userid,
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
