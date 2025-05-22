import { NextResponse } from "next/server";
import { getGuestUserCaterers } from "@/lib/controllers/users/guest/GetCaterers";

export async function GET() {
  try {
    const { status, data } = await getGuestUserCaterers();
    return NextResponse.json({ data }, { status });
  } catch (err) {
    console.error("API error:", err.message);
    return NextResponse.json(
      { error: "Internal server error!" },
      { status: 500 }
    );
  }
}