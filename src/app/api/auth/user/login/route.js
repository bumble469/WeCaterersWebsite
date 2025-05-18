import { NextResponse } from "next/server";
import { loginUser } from "@/lib/controllers/auth/user/LoginUserController";

export async function POST(req) {
  try {
    const body = await req.json();
    const { status, data } = await loginUser(body);

    if (status !== 200) {
      return NextResponse.json(data, { status });
    }

    const response = NextResponse.json(
      {
        message: data.message,
        user: data.user,
      },
      { status }
    );

    response.cookies.set("usertoken", data.usertoken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60,
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("POST route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
