import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma/client';

export const loginAdmin = async (body) => {
  const { email, password } = body;

  if (!email || !password) {
    return { status: 400, data: { error: 'Email and password are required!' } };
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return { status: 401, data: { error: 'Invalid email or password!' } };
    }

    const isMatch = await bcrypt.compare(password, admin.pas);

    if (!isMatch) {
      return { status: 401, data: { error: 'Invalid email or password!' } };
    }

    const accessToken = jwt.sign(
      { adminid: admin.id.toString(), email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '2m' }
    );

    const refreshToken = jwt.sign(
      { adminid: admin.id.toString(), email: admin.email },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '2d' }
    );

    await prisma.refresh_tokens.deleteMany({
      where: {
        adminid: admin.id,
      },
    });

    await prisma.refresh_tokens.create({
      data: {
        token: refreshToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userid: null,
        catererid: null,
        adminid: BigInt(admin.id),
      }
    });

    return {
      status: 200,
      data: {
        message: 'Login successful!',
        accessToken,
        refreshToken,
        admin: {
          id: admin.id.toString(),
          email: admin.email,
          createdat: admin.createdat,
        },
      },
    };
  } catch (err) {
    console.error('Login error:', err.message);
    return { status: 500, data: { error: 'Internal server error!' } };
  }
};
