import { NextResponse } from "next/server";
import { getUserProfileDetails } from "@/lib/controllers/users/profile/GetProfile";
import { updateUserProfile } from "@/lib/controllers/users/profile/UpdateProfile";

export async function POST(req) {
  try {
    const token = req.cookies.get("usertoken")?.value;

    const { status, data } = await getUserProfileDetails(token);

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
    const token = req.cookies.get("usertoken")?.value;
    if (!token) {
      return NextResponse.json({ error: "Authorization token missing" }, { status: 401 });
    }

    const body = await req.json();

    const {
      name,
      email,
      phone,
      address,
      bio,
      profilePicture,
      socialLinks // { instagram, twitter, facebook }
    } = body;

    const { status, message } = await updateUserProfile(token, {
        fullname: name,
        email,
        address,
        contact: phone,
        bio,
        profilephoto: profilePicture,
        sociallink1: socialLinks?.instagram,
        sociallink2: socialLinks?.twitter,
        sociallink3: socialLinks?.facebook
    });

    return NextResponse.json({ message }, { status });
  } catch (err) {
    console.error("Update API error:", err.message);
    return NextResponse.json(
      { error: "Internal server error!" },
      { status: 500 }
    );
  }
}
