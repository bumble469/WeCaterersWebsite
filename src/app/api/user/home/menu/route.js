import { NextResponse } from "next/server";
import { getCatererMenu } from "@/lib/controllers/users/home/GetCatererMenu";

export async function GET(req) {
  try {
    const token = req.cookies.get("usertoken")?.value;

    const { searchParams } = new URL(req.url);
    const cateringid = searchParams.get("cateringid");

    const { status, formattedMenu } = await getCatererMenu(token, cateringid);
    return NextResponse.json(formattedMenu, { status });
  } catch (err) {
    console.error("API error:", err.message);
    return NextResponse.json(
      { error: "Internal server error!" },
      { status: 500 }
    );
  }
}
