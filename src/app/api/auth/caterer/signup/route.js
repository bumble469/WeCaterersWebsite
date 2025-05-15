import { NextResponse } from "next/server";
import { sendEmailVerification, verifyEmail } from "@/lib/controllers/auth/caterer/SignUpCatererController";

export async function POST(req) {
  const body = await req.json();
  try {
    if (body.mode === 'send') {
      const data = await sendEmailVerification(body);
      return NextResponse.json(data, { status: 200 });
    }
    if (body.mode === 'verify') {
      const data = await verifyEmail(body);
      return NextResponse.json(data, { status: 200 });
    }
    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
  } catch (err) {
    console.error('POST handler error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
