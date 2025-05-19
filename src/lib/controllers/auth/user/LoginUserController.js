import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const loginUser = async (body) => {
  const { email, password } = body;

  if (!email || !password) {
    return { status: 400, data: { error: 'Email and password are required!' } };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { status: 401, data: { error: 'Invalid email or password!' } };
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return { status: 401, data: { error: 'Invalid email or password!' } };
    }

    const accessToken = jwt.sign(
      { userid: user.userid.toString(), email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '2m' }
    );

    const refreshToken = jwt.sign(
      { userid: user.userid.toString(), email: user.email },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '2d' }
    );

    await prisma.refresh_tokens.deleteMany({
      where: {
        userid: user.userid,
      },
    });

    await prisma.refresh_tokens.create({
      data: {
        token: refreshToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userid: user.userid,
        catererid: null
      }
    });

    return {
      status: 200,
      data: {
        message: 'Login successful!',
        accessToken,
        refreshToken,
        user: {
          userid: user.userid.toString(),
          fullname: user.fullname,
          email: user.email,
        },
      },
    };
  } catch (err) {
    console.error('Login error:', err.message);
    return { status: 500, data: { error: 'Internal server error!' } };
  }
};
