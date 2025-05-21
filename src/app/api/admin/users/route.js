import { NextResponse } from "next/server";
import { getAdminUsers } from "@/lib/controllers/admin/users/GetUsers";

export async function GET(req) {
  try {
    const token = req.cookies.get("adminToken")?.value;

    const { status, data } = await getAdminUsers(token);

    return NextResponse.json(data, { status });
  } catch (err) {
    console.error("API error:", err.message);
    return NextResponse.json(
      { error: "Internal server error!" },
      { status: 500 }
    );
  }
}
