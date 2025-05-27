import { NextResponse } from "next/server";
import { deleteCaterer } from "@/lib/controllers/auth/caterer/DeleteAccount";;

export async function DELETE(req) {
  try {
    const token = req.cookies.get("token")?.value;
    const result = await deleteCaterer(token);
    const response = NextResponse.json(result.data, { status: result.status });

    if (result.status === 200) {
      response.cookies.set('token', '', { maxAge: 0, path: '/' });
      response.cookies.set('refreshtoken', '', { maxAge: 0, path: '/' });
    }

    return response;
  } catch (err) {
    console.error('DELETE handler error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
