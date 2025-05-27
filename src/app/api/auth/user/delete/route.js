import { NextResponse } from "next/server";
import { deleteUser } from "@/lib/controllers/auth/user/DeleteAccount";

export async function DELETE(req) {
  try {
    const token = req.cookies.get("usertoken")?.value;
    const result = await deleteUser(token);
    const response = NextResponse.json(result.data, { status: result.status });

    if (result.status === 200) {
      response.cookies.set('usertoken', '', { maxAge: 0, path: '/' });
      response.cookies.set('refreshtoken', '', { maxAge: 0, path: '/' });
    }

    return response;
  } catch (err) {
    console.error('DELETE handler error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
