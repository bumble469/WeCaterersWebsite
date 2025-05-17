import { NextResponse } from "next/server";
import { addMenu } from "@/lib/controllers/caterer/menu/AddMenu";
import { getMenu } from "@/lib/controllers/caterer/menu/GetMenu";
import { editMenu } from "@/lib/controllers/caterer/menu/EditMenu";
import { deleteMenu } from "@/lib/controllers/caterer/menu/DeleteMenu";

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Authorization token missing" }, { status: 401 });
    }

    const body = await req.json();

    const { name, description, price, cuisinetype, dietarypreference, imageUrl } = body;

    const { status, message } = await addMenu(token, name, description, price, cuisinetype, dietarypreference, imageUrl);

    return NextResponse.json({ message }, { status });
  } catch (err) {
    console.error("API error:", err.message);
    return NextResponse.json(
      { error: "Internal server error!" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Authorization token missing" }, { status: 401 });
    }

    const { status, data } = await getMenu(token);

    return NextResponse.json(data, { status });
  } catch (err) {
    console.error("API GET error:", err);
    return NextResponse.json({ error: "Internal server error!" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Authorization token missing' }, { status: 401 });
    }

    const body = await req.json();
    const { menuid, name, description, price, cuisinetype, dietarypreference, image } = body;

    // Validate menuid is present and valid
    if (!menuid) {
      return NextResponse.json({ error: 'menuid is required' }, { status: 400 });
    }
    const menuIdInt = parseInt(menuid);
    if (isNaN(menuIdInt)) {
      return NextResponse.json({ error: 'Invalid menuid' }, { status: 400 });
    }

    // No strict validation on other fields since they are optional
    // But if fields are present, you can optionally validate their types:
    if (name !== undefined && typeof name !== 'string') {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
    }
    if (description !== undefined && typeof description !== 'string') {
      return NextResponse.json({ error: 'Invalid description' }, { status: 400 });
    }
    if (price !== undefined && typeof price !== 'number') {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
    }
    if (cuisinetype !== undefined && typeof cuisinetype !== 'string') {
      return NextResponse.json({ error: 'Invalid cuisinetype' }, { status: 400 });
    }
    if (dietarypreference !== undefined && typeof dietarypreference !== 'string') {
      return NextResponse.json({ error: 'Invalid dietarypreference' }, { status: 400 });
    }
    // image can be string (base64) or null/undefined - no strict check here

    const result = await editMenu(
      token,
      menuIdInt,
      name,
      description,
      price,
      cuisinetype,
      dietarypreference,
      image
    );

    return NextResponse.json(result.data ?? { message: result.message }, { status: result.status });
  } catch (err) {
    console.error('PUT /api/menu error:', err);
    return NextResponse.json({ error: 'Internal server error!' }, { status: 500 });
  }
}


export async function DELETE(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Authorization token missing" }, { status: 401 });
    }

    const body = await req.json();
    const { menuid } = body;

    if (!menuid) {
      return NextResponse.json({ error: "Missing menu ID" }, { status: 400 });
    }

    const { status, message } = await deleteMenu(token, menuid);

    return NextResponse.json(message, { status });
  } catch (err) {
    console.error("API DELETE error:", err);
    return NextResponse.json({ error: "Internal server error!" }, { status: 500 });
  }
}