// src/app/api/shipping/estimate/route.ts
import { NextResponse } from "next/server";
import { calcShippingSimple } from "@/utils/shipping";

type ReqBody = {
  items?: Array<{ price?: number; quantity?: number }>;
  subtotal?: number | null;
  address?: {
    province?: string | null;
    district?: string | null;
    ward?: string | null;
  } | null;
};

export async function POST(req: Request) {
  try {
    const body: ReqBody = await req.json();
    const { items = [], subtotal = null, address = null } = body || {};

    // compute subtotal if not provided
    let sub = 0;
    if (subtotal !== null && subtotal !== undefined) {
      sub = Number(subtotal) || 0;
    } else if (Array.isArray(items) && items.length > 0) {
      sub = items.reduce(
        (s: number, it: any) =>
          s + Number(it?.price || 0) * Number(it?.quantity || 0),
        0
      );
    }

    // basic address shape check (optional)
    const addr = address && typeof address === "object" ? address : null;

    const shippingFee = await calcShippingSimple(sub, addr);

    // if calcShippingSimple returns -1 => not deliverable
    if (shippingFee === -1) {
      return NextResponse.json(
        {
          shippingFee: null,
          deliverable: false,
          message: "Không hỗ trợ giao tới địa chỉ này",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { shippingFee, deliverable: true },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("POST /api/shipping/estimate error:", err);
    return NextResponse.json({ error: "Estimate failed" }, { status: 500 });
  }
}
