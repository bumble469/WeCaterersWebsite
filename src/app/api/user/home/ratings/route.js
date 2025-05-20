import { NextResponse } from "next/server";
import { userRating } from "@/lib/controllers/users/home/UserRating";
import { getUserRating } from "@/lib/controllers/users/home/GetRating";
export async function POST(req) {
  try {
    const body = await req.json();
    const { cateringid, rating } = body;
    const token = req.cookies.get("usertoken")?.value;

    if (!cateringid || !rating) {
      return NextResponse.json({ error: "cateringid and rating are required" }, { status: 400 });
    }

    const { status: resStatus, data } = await userRating(token, rating, cateringid);

    return NextResponse.json(data, { status: resStatus });
  } catch (err) {
    console.error("API error: ", err.message);
    return NextResponse.json({ error: "Internal server error!" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const cateringid = url.searchParams.get("cateringid");
    const token = req.cookies.get("usertoken")?.value;

    if (!cateringid) {
      return NextResponse.json({ error: "cateringid query parameter is required" }, { status: 400 });
    }

    if (!token) {
      return NextResponse.json({ error: "Authorization token is required" }, { status: 401 });
    }

    const { status: resStatus, data } = await getUserRating(token, cateringid);

    return NextResponse.json(data, { status: resStatus });
  } catch (err) {
    console.error("API error: ", err.message);
    return NextResponse.json({ error: "Internal server error!" }, { status: 500 });
  }
}