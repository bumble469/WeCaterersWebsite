import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma/client';

export const logoutAdmin = async (token) => {
  if (!token) {
    return { status: 401, data: { error: 'Authorization token is required!' } };
  }

  try {
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);

    const adminid = parseInt(decoded.adminid);
    if (!adminid) {
      return { status: 403, data: { error: 'Invalid token: adminid missing' } };
    }

    const admin = await prisma.admin.findUnique({ where: { id: adminid } });
    if (!admin) {
      return { status: 404, data: { error: 'Admin not found' } };
    }

    await prisma.refresh_tokens.deleteMany({
      where: {
        adminid: adminid,
      },
    });

    return { status: 200, data: { message: 'Logout successful' } };
  } catch (err) {
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
      return { status: 403, data: { error: 'Invalid or expired token!' } };
    }
    console.error('Logout error (admin):', err.message);
    return { status: 500, data: { error: 'Internal server error!' } };
  }
};
