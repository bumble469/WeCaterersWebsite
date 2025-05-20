import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    return { status: 401, data: { error: 'Refresh token is required' } };
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const storedToken = await prisma.refresh_tokens.findUnique({
      where: { token: refreshToken },
    });

    if (
      !storedToken ||
      new Date(storedToken.expires_at) < new Date()
    ) {
      return { status: 403, data: { error: 'Refresh token expired or invalid' } };
    }

    const newAccessToken = jwt.sign(
      { userid: decoded.userid.toString(), email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    );

    return {
      status: 200,
      data: {
        accessToken: newAccessToken,
        message: 'Access token refreshed',
      },
    };
  } catch (error) {
    console.error('Refresh token error:', error.message);
    return { status: 403, data: { error: 'Invalid refresh token' } };
  }
};
