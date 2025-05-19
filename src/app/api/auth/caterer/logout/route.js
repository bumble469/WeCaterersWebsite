import { NextResponse } from "next/server";
import { logoutCaterer } from "@/lib/controllers/auth/caterer/LogoutCatererController";

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;

    const result = await logoutCaterer(token);

    if (result.status === 200) {
      const response = NextResponse.json(result.data, { status: 200 });
      response.cookies.set('token', '', { maxAge: 0, path: '/' });
      return response;
    }

    return NextResponse.json(result.data, { status: result.status });
  } catch (err) {
    console.error('Logout route error:', err.message);
    return NextResponse.json({ error: 'Internal server error!' }, { status: 500 });
  }
}
