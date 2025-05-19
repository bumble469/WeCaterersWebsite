import { NextResponse } from "next/server";
import { getCaterers } from "@/lib/controllers/users/home/GetCaterers";

export async function GET(req) {
  try {
    const token = req.cookies.get("usertoken")?.value;
    const { status, data } = await getCaterers(token);

    return NextResponse.json({ data }, { status });
  } catch (err) {
    console.error("API error:", err.message);
    return NextResponse.json(
      { error: "Internal server error!" },
      { status: 500 }
    );
  }
}