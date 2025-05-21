import { NextResponse } from "next/server";
import { loginAdmin } from "@/lib/controllers/auth/admin/LoginAdmin";

export async function POST(req) {
  try {
    const body = await req.json();
    const { status, data } = await loginAdmin(body);

    if (status !== 200) {
      // If login failed, return the error from controller
      return NextResponse.json(data, { status });
    }

    const response = NextResponse.json(
      {
        message: data.message,
        admin: data.admin,
      },
      { status }
    );

    // Set access token cookie
    response.cookies.set("adminToken", data.accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 2 * 60, // 2 minutes
      sameSite: "lax",
      path: "/",
    });

    // Set refresh token cookie
    response.cookies.set("refreshtoken", data.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60, // 7 days
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("POST route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
