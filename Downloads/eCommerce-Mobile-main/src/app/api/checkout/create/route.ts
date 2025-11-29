// src/app/api/checkout/create/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/**
 * Simple shipping calc (server-side)
 * - free if subtotal >= FREE_THRESHOLD
 * - else: same province / neighbor / far
 */
const FREE_THRESHOLD = 2_000_000; // VND
const BASE_LOCAL = 25000;
const BASE_NEIGHBOR = 45000;
const BASE_FAR = 80000;
const ORIGIN_PROVINCE = "Hồ Chí Minh";
const NEIGHBOR_MAP: Record<string, string[]> = {
  "Hồ Chí Minh": ["Bình Dương", "Bình Phước", "Long An", "Tiền Giang"],
  "Hà Nội": ["Hưng Yên", "Hà Nam", "Hải Dương", "Bắc Ninh"],
};

function normalizeProv(p?: string | null) {
  if (!p) return "";
  return String(p).trim();
}

function calcShippingSimple(subtotal: number, address?: { province?: string | null }) {
  if (subtotal >= FREE_THRESHOLD) return 0;
  const prov = normalizeProv(address?.province);
  if (!prov) return BASE_FAR;
  if (prov === ORIGIN_PROVINCE) return BASE_LOCAL;
  const neighbors = NEIGHBOR_MAP[ORIGIN_PROVINCE] || [];
  if (neighbors.includes(prov)) return BASE_NEIGHBOR;
  return BASE_FAR;
}

/**
 * Payload item type
 */
type PayloadItem = {
  variantId: number;
  price: number;
  quantity: number;
  nameSnapshot?: string;
  categoryId?: number | null;
  brandId?: number | null;
};

/**
 * Parse items from request
 */
function parseItems(raw: any): PayloadItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((it) => ({
    variantId: Number(it.variantId),
    price: Number(it.price || 0),
    quantity: Number(it.quantity || 0),
    nameSnapshot: it.nameSnapshot || "",
    categoryId: it.categoryId === undefined ? null : (it.categoryId === null ? null : Number(it.categoryId)),
    brandId: it.brandId === undefined ? null : (it.brandId === null ? null : Number(it.brandId)),
  }));
}

/**
 * Server-side coupon validation (compatible with your Coupon model)
 */
async function validateCouponServer(code: string, items: PayloadItem[], subtotal: number) {
  const codeNormalized = String(code || "").trim();
  if (!codeNormalized) return { ok: false, reason: "missing_code" };

  const coupon = await prisma.coupon.findFirst({ where: { code: codeNormalized } });
  if (!coupon) return { ok: false, reason: "not_found" };

  const now = new Date();
  if (coupon.status !== "active") return { ok: false, reason: "inactive", coupon };
  if (coupon.startsAt && now < new Date(coupon.startsAt)) return { ok: false, reason: "not_started", coupon };
  if (coupon.endsAt && now > new Date(coupon.endsAt)) return { ok: false, reason: "expired", coupon };

  const eligibleAmount = items && items.length > 0
    ? items
        .filter((it) => {
          if (coupon.categoryId !== null && coupon.categoryId !== undefined) {
            if (Number(it.categoryId) !== Number(coupon.categoryId)) return false;
          }
          if (coupon.brandId !== null && coupon.brandId !== undefined) {
            if (Number(it.brandId) !== Number(coupon.brandId)) return false;
          }
          return true;
        })
        .reduce((s, it) => s + (Number(it.price || 0) * Number(it.quantity || 0)), 0)
    : (subtotal ?? 0);

  const minOrder = Number(coupon.minOrder ?? 0);
  const maxOrder = Number(coupon.maxOrder ?? 0);

  if (eligibleAmount < minOrder) return { ok: false, reason: "min_order_not_met", coupon, eligibleAmount };
  if (maxOrder > 0 && eligibleAmount > maxOrder) return { ok: false, reason: "max_order_exceeded", coupon, eligibleAmount };
  if ((coupon.categoryId || coupon.brandId) && eligibleAmount <= 0) return { ok: false, reason: "scope_mismatch", coupon, eligibleAmount };

  if (coupon.usageLimit !== null && coupon.usageLimit !== undefined) {
    if (Number(coupon.used ?? 0) >= Number(coupon.usageLimit)) {
      return { ok: false, reason: "usage_limit_exceeded", coupon, eligibleAmount };
    }
  }

  // compute discount
  let computedDiscount = 0;
  if (coupon.type === "fixed") {
    computedDiscount = Math.min(Number(coupon.value ?? 0), eligibleAmount);
  } else {
    const pct = Math.max(0, Math.min(100, Number(coupon.value ?? 0)));
    computedDiscount = Math.floor((eligibleAmount * pct) / 100);
  }

  return { ok: true, coupon, eligibleAmount, computedDiscount };
}

/**
 * Helper: extract token cookie from Request headers
 */
function extractTokenFromCookieHeader(req: Request): string | null {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    if (!cookieHeader) return null;
    const parts = cookieHeader.split(";").map((s) => s.trim());
    const tokenPart = parts.find((p) => p.startsWith("token="));
    if (!tokenPart) return null;
    return tokenPart.split("=")[1] || null;
  } catch {
    return null;
  }
}

/**
 * POST /api/checkout/create
 * - Auth via token cookie
 * - Validate coupon, check stock, create order + items + paymentTransaction
 * - Decrement variant stock
 * - Sync user's cart (decrement or delete cart items)
 * All DB writes happen inside a single transaction for atomicity.
 */
export async function POST(req: Request) {
  try {
    // auth
    const token = extractTokenFromCookieHeader(req);
    if (!token) return NextResponse.json({ error: "Unauthorized: missing token" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload || !payload.id) return NextResponse.json({ error: "Unauthorized: invalid token" }, { status: 401 });
    const userId = Number(payload.id);

    const body = await req.json();
    const {
      subtotal: clientSubtotal,
      addressSnapshot,
      items: rawItems,
      paymentMethodId,
      note,
      couponCode,
      paymentMeta,
    } = body || {};

    const items = parseItems(rawItems || []);
    const subtotal = Number(clientSubtotal ?? items.reduce((s, it) => s + (Number(it.price || 0) * Number(it.quantity || 0)), 0));

    // compute shipping server-side
    const shippingFee = calcShippingSimple(subtotal, addressSnapshot?.address || null);

    // validate coupon if provided
    let appliedCouponRecord: any = null;
    let computedDiscount = 0;
    if (couponCode) {
      const couponValidation = await validateCouponServer(couponCode, items, subtotal);
      if (!couponValidation.ok) {
        return NextResponse.json({ error: "Coupon invalid", reason: couponValidation.reason }, { status: 400 });
      }
      appliedCouponRecord = couponValidation.coupon;
      computedDiscount = Number(couponValidation.computedDiscount || 0);
    }

    // quick pre-check stock availability to fail fast (we will re-check inside tx)
    for (const it of items) {
      if (!it.variantId || it.quantity <= 0) {
        return NextResponse.json({ error: "Invalid item payload" }, { status: 400 });
      }
      const variant = await prisma.variant.findUnique({ where: { id: Number(it.variantId) } });
      if (!variant) return NextResponse.json({ error: `Variant ${it.variantId} not found` }, { status: 400 });
      if (variant.stock < it.quantity) {
        return NextResponse.json({ error: "Insufficient stock", variantId: it.variantId, available: variant.stock }, { status: 400 });
      }
    }

    // final total
    const total = Math.max(0, subtotal + shippingFee - computedDiscount);

    // create order + items + paymentTransaction + update stock + coupon.used + sync cart in a transaction
    const orderCode = `ORD${Date.now()}`; // simple generator
    const now = new Date();

    const result = await prisma.$transaction(async (tx) => {
      // re-check stock inside transaction and decrement
      for (const it of items) {
        const v = await tx.variant.findUnique({ where: { id: Number(it.variantId) } });
        if (!v) throw new Error(`Variant ${it.variantId} not found`);
        if (v.stock < it.quantity) throw new Error(`Insufficient stock for variant ${it.variantId}`);
        await tx.variant.update({
          where: { id: Number(it.variantId) },
          data: { stock: { decrement: Number(it.quantity) } },
        });
      }

      // create order
      const order = await tx.order.create({
        data: {
          userId: userId,
          code: orderCode,
          status: "pending",
          paymentStatus: "pending",
          discount: computedDiscount,
          shippingFee: shippingFee,
          subtotal: subtotal,
          total: total,
          addressSnapshot: addressSnapshot ? addressSnapshot : null,
          note: note || null,
          createdAt: now,
        },
      });

      // create order items
      for (const it of items) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            variantId: Number(it.variantId),
            price: Number(it.price || 0),
            quantity: Number(it.quantity || 0),
            nameSnapshot: it.nameSnapshot || "",
          },
        });
      }

      // create payment transaction record
      // Note: schema includes providerPaymentId; providerResponse/idempotencyKey not present in your schema
      const paymentTxn = await tx.paymentTransaction.create({
        data: {
          orderId: order.id,
          paymentMethodId: paymentMethodId ? Number(paymentMethodId) : null,
          amount: total,
          status: "pending",
          providerPaymentId: paymentMeta?.providerPaymentId || null,
          createdAt: now,
        },
      });

      // increment coupon used if applied
      if (appliedCouponRecord) {
        await tx.coupon.update({
          where: { id: Number(appliedCouponRecord.id) },
          data: { used: { increment: 1 } },
        });
      }

      // sync user's cart: decrement or delete cart items that were purchased
      const userCart = await tx.cart.findUnique({
        where: { userId: userId },
        include: { items: true },
      });

      if (userCart && Array.isArray(userCart.items)) {
        for (const it of items) {
          const cartItem = userCart.items.find((ci) => Number(ci.variantId) === Number(it.variantId));
          if (!cartItem) continue;
          if (cartItem.quantity <= it.quantity) {
            await tx.cartItem.delete({ where: { id: cartItem.id } });
          } else {
            await tx.cartItem.update({
              where: { id: cartItem.id },
              data: { quantity: { decrement: Number(it.quantity) } },
            });
          }
        }
      }

      return { order, paymentTxn };
    });

    return NextResponse.json({
      ok: true,
      orderId: result.order.id,
      orderCode: result.order.code,
      paymentTransactionId: result.paymentTxn.id,
    }, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/checkout/create error:", err);
    const msg = String(err?.message || "");
    if (msg.toLowerCase().includes("insufficient stock")) {
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    return NextResponse.json({ error: err?.message || "Order creation failed" }, { status: 500 });
  }
}
