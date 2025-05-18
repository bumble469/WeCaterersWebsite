import { NextResponse } from "next/server";
import { getCatererOverview } from "@/lib/controllers/caterer/overview/GetOverview";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

    const { status, data } = await getCatererOverview(token);

    return NextResponse.json(data, { status });
  } catch (err) {
    console.error("API error:", err.message);
    return NextResponse.json(
      { error: "Internal server error!" },
      { status: 500 }
    );
  }
}
