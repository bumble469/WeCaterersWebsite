import { NextResponse } from "next/server";
import { getCatererService } from "@/lib/controllers/users/home/GetCatererServices";

export async function GET(req) {
  try {
    const token = req.cookies.get("usertoken")?.value;

    const { searchParams } = new URL(req.url);
    const cateringid = searchParams.get("cateringid");

    const { status, formattedServices } = await getCatererService(token, cateringid);
    return NextResponse.json(formattedServices, { status });
  } catch (err) {
    console.error("API error:", err.message);
    return NextResponse.json(
      { error: "Internal server error!" },
      { status: 500 }
    );
  }
}
