import { NextResponse } from 'next/server';
import { refreshAccessToken } from '@/lib/controllers/auth/user/RefreshTokenController';

export async function POST(req) {
  try {
    const refreshToken = req.cookies.get('refreshtoken')?.value;

    const { status, data } = await refreshAccessToken(refreshToken);

    if (status !== 200) {
      return NextResponse.json(data, { status });
    }

    const response = NextResponse.json(data, { status });

    response.cookies.set('usertoken', data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 20,
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('Refresh token route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
