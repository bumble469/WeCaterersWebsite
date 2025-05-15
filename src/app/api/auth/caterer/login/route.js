import { NextResponse } from "next/server";
import { loginCaterer } from "@/lib/controllers/auth/caterer/LoginCatererController";

export async function POST(req) {
  const body = await req.json();
  try {
    const { status, data } = await loginCaterer(body);
    return NextResponse.json(data, { status });
  } catch (err) {
    console.error('POST route error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
