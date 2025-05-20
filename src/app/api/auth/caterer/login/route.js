import { NextResponse } from "next/server";
import { loginCaterer } from "@/lib/controllers/auth/caterer/LoginCatererController";

export async function POST(req) {
  try {
    const body = await req.json();
    const { status, data } = await loginCaterer(body);

    const response = NextResponse.json(
      {
        message: data.message,
        caterer: data.caterer,
      },
      { status }
    );

    response.cookies.set("token", data.accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 2 * 60, 
      sameSite: "lax",
      path: "/",
    });

    response.cookies.set("refreshtoken", data.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60, 
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("POST route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
