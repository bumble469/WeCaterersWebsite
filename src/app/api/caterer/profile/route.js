import { NextResponse } from "next/server";
import { getCatererProfile } from "@/lib/controllers/caterer/profile/ProfileController";
import { updateCatererProfile } from "@/lib/controllers/caterer/profile/UpdateProfileController";

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;

    const { status, data } = await getCatererProfile(token);

    return NextResponse.json(data, { status });
  } catch (err) {
    console.error("API error:", err.message);
    return NextResponse.json(
      { error: "Internal server error!" },
      { status: 500 }
    );
  }
}


export async function PUT(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Authorization token missing" }, { status: 401 });
    }

    const body = await req.json();

    const { cateringname, ownername, contact, email, address, description, cateringimage, cateringbannerimage, eventtype } = body;

    const { status, message } = await updateCatererProfile(
      token,
      cateringname,
      ownername,
      contact,
      email,
      address,
      description,
      cateringimage,
      cateringbannerimage,
      eventtype
    );

    return NextResponse.json({ message }, { status });
  } catch (err) {
    console.error("Update API error:", err.message);
    return NextResponse.json(
      { error: "Internal server error!" },
      { status: 500 }
    );
  }
}
