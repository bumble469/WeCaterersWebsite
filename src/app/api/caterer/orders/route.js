import { NextResponse } from "next/server";
import { getCatererOrders } from "@/lib/controllers/caterer/orders/GetOrders";
import { updateCatererOrders } from "@/lib/controllers/caterer/orders/UpdateOrders";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

    const { status: resStatus, data } = await getCatererOrders(token);
    return NextResponse.json(data, { status: resStatus });

  } catch (err) {
    console.error("API error: ", err.message);
    return NextResponse.json({ error: "Internal server error!" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Authorization token is required!" }, { status: 401 });
    }

    const body = await req.json();
    const { orderid, status } = body;

    const { status: resStatus, data } = await updateCatererOrders(token, orderid, status);

    return NextResponse.json(data, { status: resStatus });

  } catch (err) {
    console.error("API error: ", err.message);
    return NextResponse.json({ error: "Internal server error!" }, { status: 500 });
  }
}