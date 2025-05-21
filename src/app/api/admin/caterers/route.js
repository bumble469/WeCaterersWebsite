import { NextResponse } from "next/server";
import { getAdminCaterers } from "@/lib/controllers/admin/caterers/GetCaterers";

export async function GET(req) {
  try {
    const token = req.cookies.get("adminToken")?.value;

    const { status, data } = await getAdminCaterers(token);

    return NextResponse.json(data, { status });
  } catch (err) {
    console.error("API error:", err.message);
    return NextResponse.json(
      { error: "Internal server error!" },
      { status: 500 }
    );
  }
}
