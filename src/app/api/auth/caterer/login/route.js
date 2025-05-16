import { NextResponse } from "next/server";
import { loginCaterer } from "@/lib/controllers/auth/caterer/LoginCatererController";

export async function POST(req) {
  try {
    const body = await req.json();
    const { status, data } = await loginCaterer(body);

    // Create the response
    const response = NextResponse.json(
      {
        message: data.message,
        caterer: data.caterer,
      },
      { status }
    );

    response.cookies.set("token", data.token, {
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
