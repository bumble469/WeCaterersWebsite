import { NextResponse } from "next/server";
import { createOrderFromCart } from "@/lib/controllers/users/orders/CreateOrder";
import { getUserOrders } from "@/lib/controllers/users/orders/GetOrders";
import { requestCancelOrders } from "@/lib/controllers/users/orders/RequestCancelOrder";
import { deleteUserOrders } from "@/lib/controllers/users/orders/DeleteOrder";

export async function POST(req) {
  try {
    const body = await req.json();
    const { cateringid, status, notes, total_price } = body;
    const token = req.cookies.get("usertoken")?.value;

    if (!cateringid) {
      return NextResponse.json({ error: "cateringid is required" }, { status: 400 });
    }

    const { status: resStatus, data } = await createOrderFromCart(token, cateringid, status, notes, total_price);

    return NextResponse.json(data, { status: resStatus });
  } catch (err) {
    console.error("API error: ", err.message);
    return NextResponse.json({ error: "Internal server error!" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const token = req.cookies.get("usertoken")?.value;

    const { status: resStatus, data } = await getUserOrders(token);
    return NextResponse.json(data, { status: resStatus });

  } catch (err) {
    console.error("API error: ", err.message);
    return NextResponse.json({ error: "Internal server error!" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const token = req.cookies.get("usertoken")?.value;

    if (!token) {
      return NextResponse.json({ error: "No authorization token provided" }, { status: 401 });
    }

    const body = await req.json();
    const { orderid } = body;

    if (!orderid) {
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
    }

    const result = await requestCancelOrders(token, orderid);

    return NextResponse.json(result.data, { status: result.status });

  } catch (err) {
    console.error("API error:", err.message);
    return NextResponse.json({ error: "Internal server error!" }, { status: 500 });
  }
}


export async function DELETE(req) {
  try {
    const token = req.cookies.get("usertoken")?.value;

    if (!token) {
      return NextResponse.json({ error: "No authorization token provided" }, { status: 401 });
    }

    const body = await req.json();
    const { orderid } = body;

    if (!orderid) {
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
    }

    const result = await deleteUserOrders(token, orderid);

    return NextResponse.json(result.data, { status: result.status });

  } catch (err) {
    console.error("API error:", err.message);
    return NextResponse.json({ error: "Internal server error!" }, { status: 500 });
  }
}