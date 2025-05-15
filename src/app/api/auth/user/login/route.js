import { NextResponse } from "next/server";
import { loginUser } from "@/lib/controllers/auth/user/LoginUserController";

export async function POST(req) {
  const body = await req.json();
  try {
    const { status, data } = await loginUser(body);
    return NextResponse.json(data, { status });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
