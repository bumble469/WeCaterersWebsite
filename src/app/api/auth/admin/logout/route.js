import { NextResponse } from "next/server";
import { logoutAdmin } from "@/lib/controllers/auth/admin/LogoutAdmin";
export async function POST(req) {
  try {
    const token = req.cookies.get("adminToken")?.value;

    const result = await logoutAdmin(token);

    if (result.status === 200) {
      const response = NextResponse.json(result.data, { status: 200 });
      response.cookies.set('adminToken', '', { maxAge: 0, path: '/' });
      response.cookies.set('refreshtoken', '', { maxAge: 0, path: '/' });
      return response;
    }

    return NextResponse.json(result.data, { status: result.status });
  } catch (err) {
    console.error('Logout route error:', err.message);
    return NextResponse.json({ error: 'Internal server error!' }, { status: 500 });
  }
}
