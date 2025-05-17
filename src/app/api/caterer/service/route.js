import { NextResponse } from "next/server";
import { addService } from "@/lib/controllers/caterer/service/AddService";
import { getServices } from "@/lib/controllers/caterer/service/GetService";
import { deleteServices } from "@/lib/controllers/caterer/service/DeleteService";
import { editServices } from "@/lib/controllers/caterer/service/EditService";

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Authorization token missing" }, { status: 401 });
    }

    const body = await req.json(); 
    const { name, description, price, capacity, availability } = body;

    const { status, message, data } = await addService(token, name, description, price, capacity, availability); 

    return NextResponse.json({ message, data }, { status }); 
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

    const { status, data } = await getServices(token);

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
    const { serviceid, name, description, price, capacity, availability } = body;

    if (
      !serviceid || !name || !description ||
      typeof price !== 'number' || typeof capacity !== 'number' ||
      typeof availability !== 'boolean'
    ) {
      return NextResponse.json({ error: 'Invalid or missing request fields' }, { status: 400 });
    }

    const result = await editServices(
      token,
      parseInt(serviceid),
      name,
      description,
      price,
      capacity,
      availability
    );

    return NextResponse.json(result.data, { status: result.status });
  } catch (err) {
    console.error('PUT /api/service error:', err);
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
    const { serviceid } = body;

    if (!serviceid) {
      return NextResponse.json({ error: "Missing service ID" }, { status: 400 });
    }

    const { status, data } = await deleteServices(token, serviceid);

    return NextResponse.json(data, { status });
  } catch (err) {
    console.error("API DELETE error:", err);
    return NextResponse.json({ error: "Internal server error!" }, { status: 500 });
  }
}