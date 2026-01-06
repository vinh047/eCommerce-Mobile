import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type CartItem = {
  price: number;
  quantity: number;
  categoryId?: number | null;
  brandId?: number | null;
};

function parseItems(payloadItems: any): CartItem[] {
  if (!Array.isArray(payloadItems)) return [];
  return payloadItems.map((it: any) => ({
    price: Number(it.price) || 0,
    quantity: Number(it.quantity) || 0,
    categoryId:
      it.categoryId === undefined
        ? null
        : it.categoryId === null
        ? null
        : Number(it.categoryId),
    brandId:
      it.brandId === undefined
        ? null
        : it.brandId === null
        ? null
        : Number(it.brandId),
  }));
}

function computeEligibleAmount(
  items: CartItem[],
  couponCategoryId: number | null,
  couponBrandId: number | null
) {
  if (!items || items.length === 0) return 0;
  return items
    .filter((it) => {
      if (couponCategoryId !== null && couponCategoryId !== undefined) {
        if (Number(it.categoryId) !== Number(couponCategoryId)) return false;
      }
      if (couponBrandId !== null && couponBrandId !== undefined) {
        if (Number(it.brandId) !== Number(couponBrandId)) return false;
      }
      return true;
    })
    .reduce(
      (s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 0),
      0
    );
}

function computeDiscount(eligibleAmount: number, type: string, value: number) {
  if (!eligibleAmount || eligibleAmount <= 0) return 0;
  if (type === "fixed") return Math.min(value, eligibleAmount);
  const pct = Math.max(0, Math.min(100, value));
  return Math.floor((eligibleAmount * pct) / 100);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, items: rawItems, subtotal, userId } = body;

    if (!code) {
      return NextResponse.json(
        { ok: false, error: "Missing code" },
        { status: 400 }
      );
    }

    const codeNormalized = String(code).trim();

    const coupon = await prisma.coupon.findFirst({
      where: { code: codeNormalized },
    });

    if (!coupon) {
      return NextResponse.json(
        { ok: false, error: "Coupon not found", coupon: null },
        { status: 200 }
      );
    }

    // prepare items/subtotal
    const items = parseItems(rawItems || []);
    const cartSubtotal =
      subtotal !== undefined && subtotal !== null ? Number(subtotal) : null;
    const eligibleAmount =
      items.length > 0
        ? computeEligibleAmount(
            items,
            coupon.categoryId ?? null,
            coupon.brandId ?? null
          )
        : cartSubtotal !== null
        ? Number(cartSubtotal)
        : 0;

    // validation checks
    const now = new Date();
    let valid = true;
    let reason: string | null = null;

    if (coupon.status !== "active") {
      valid = false;
      reason = "inactive";
    }

    if (valid && coupon.startsAt && now < new Date(coupon.startsAt)) {
      valid = false;
      reason = "not_started";
    }

    if (valid && coupon.endsAt && now > new Date(coupon.endsAt)) {
      valid = false;
      reason = "expired";
    }

    const minOrder = Number(coupon.minOrder ?? 0);
    const maxOrder = Number(coupon.maxOrder ?? 0); // Decimal?, default 0.00

    if (valid && eligibleAmount < minOrder) {
      valid = false;
      reason = "min_order_not_met";
    }

    // If maxOrder is set (> 0) and eligibleAmount exceeds it, reject
    if (valid && maxOrder > 0 && eligibleAmount > maxOrder) {
      valid = false;
      reason = "max_order_exceeded";
    }

    if (valid && (coupon.categoryId || coupon.brandId) && eligibleAmount <= 0) {
      valid = false;
      reason = "scope_mismatch";
    }

    if (
      valid &&
      coupon.usageLimit !== null &&
      coupon.usageLimit !== undefined &&
      Number(coupon.used ?? 0) >= Number(coupon.usageLimit)
    ) {
      valid = false;
      reason = "usage_limit_exceeded";
    }

    // NOTE: Nếu bạn muốn maxOrder đóng vai trò "giới hạn phần tổng được giảm",
    // có thể clamp eligibleAmount ở đây:
    // const effectiveEligible = maxOrder > 0 ? Math.min(eligibleAmount, maxOrder) : eligibleAmount;
    // const computedDiscount = valid ? computeDiscount(effectiveEligible, String(coupon.type), Number(coupon.value ?? 0)) : 0;

    const computedDiscount = valid
      ? computeDiscount(
          eligibleAmount,
          String(coupon.type),
          Number(coupon.value ?? 0)
        )
      : 0;

    return NextResponse.json({
      ok: valid,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        minOrder: coupon.minOrder,
        maxOrder: coupon.maxOrder,
        startsAt: coupon.startsAt,
        endsAt: coupon.endsAt,
        usageLimit: coupon.usageLimit,
        used: coupon.used,
        status: coupon.status,
        categoryId: coupon.categoryId,
        brandId: coupon.brandId,
      },
      eligibleAmount,
      computedDiscount,
      couponValidForCart: valid,
      couponInvalidReason: reason,
    });
  } catch (err: any) {
    console.error("POST /api/coupons/validate error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Validation failed" },
      { status: 500 }
    );
  }
}
