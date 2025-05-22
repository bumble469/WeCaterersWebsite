import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const loginCaterer = async (body) => {
  const { email, password } = body;

  if (!email || !password) {
    return { status: 400, data: { error: 'Email and password are required!' } };
  }

  try {
    const caterer = await prisma.caterer.findUnique({
      where: { email },
    });

    if (!caterer) {
      return { status: 401, data: { error: 'Invalid email or password!' } };
    }

    const isMatch = await bcrypt.compare(password, caterer.password);

    if (!isMatch) {
      return { status: 401, data: { error: 'Invalid email or password!' } };
    }

    const accessToken = jwt.sign(
      { cateringid: caterer.cateringid.toString(), email: caterer.email },
      process.env.JWT_SECRET,
      { expiresIn: '15s' }
    );

    const refreshToken = jwt.sign(
      { cateringid: caterer.cateringid.toString(), email: caterer.email },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '2d' }
    );

    await prisma.refresh_tokens.deleteMany({
      where:{
        catererid: caterer.cateringid
      }
    });

    await prisma.refresh_tokens.create({
      data:{
        token:refreshToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userid: null,
        catererid: caterer.cateringid,
        adminid: null,
      }
    });

    return {
      status: 200,
      data: {
        message: 'Login successful!',
        accessToken,
        refreshToken,
        caterer: {
          cateringid: caterer.cateringid.toString(),
          cateringname: caterer.cateringname,
          ownername: caterer.ownername,
          email: caterer.email,
        },
      },
    };
  } catch (err) {
    console.error('Login error (caterer):', err.message);
    return { status: 500, data: { error: 'Internal server error!' } };
  }
};
