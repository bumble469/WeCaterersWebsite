import { NextResponse } from "next/server";
import { addToCart } from "@/lib/controllers/users/cart/AddToCart";
import { getCart } from "@/lib/controllers/users/cart/GetCart";
import { updateCartItem } from "@/lib/controllers/users/cart/UpdateCart";
import { deleteCartItem } from "@/lib/controllers/users/cart/DeleteCart";

export async function POST(req) {
  try {
    const body = await req.json();
    const { cateringid, menuid, serviceid, quantity } = body;
    const token = req.cookies.get("usertoken")?.value;

    const { status, data } = await addToCart(token, cateringid, menuid, serviceid, quantity);

    return NextResponse.json(data, { status });
  } catch (err) {
    console.error("API error: ", err.message);
    return NextResponse.json({ error: "Internal server error!" }, { status: 500 });
  }
}


export async function GET(req) {
  try {
    const token = req.cookies.get("usertoken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await getCart(token);

    return NextResponse.json(result.data, { status: result.status });
  } catch (err) {
    console.error("API error:", err.message);
    return NextResponse.json({ error: result.message }, { status: result.status });
  }
}

export async function PUT(req) {
  try {
    const token = req.cookies.get("usertoken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { cartid, menuid, serviceid, quantity } = body;

    if (!cartid || (!menuid && !serviceid)) {
      return NextResponse.json(
        { error: "Missing cartid and either menuid or serviceid" },
        { status: 400 }
      );
    }

    const result = await updateCartItem(token, cartid, menuid, quantity);

    const message = result.message || result.data?.message;

    return NextResponse.json(
      { message: message || "Item updated!" },
      { status: result.status }
    );
  } catch (err) {
    console.error("API error:", err.message);
    return NextResponse.json({ error: "Internal server error!" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const token = req.cookies.get("usertoken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { cartid, menuid, serviceid } = body;

    if (!cartid || (!menuid && !serviceid)) {
      return NextResponse.json({ error: "Missing cartid and either menuid or serviceid" }, { status: 400 });
    }

    const result = await deleteCartItem(token, cartid, menuid, serviceid);

    return NextResponse.json({ message: result.message }, { status: result.status });
  } catch (err) {
    console.error("API error:", err.message);
    return NextResponse.json({ error: "Internal server error!" }, { status: 500 });
  }
}

