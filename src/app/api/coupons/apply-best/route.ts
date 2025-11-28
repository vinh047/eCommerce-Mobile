import { NextResponse } from "next/server";
import { PrismaClient, CouponType, AccountStatus } from "@prisma/client";

const prisma = new PrismaClient();

type ApplyBestBody = {
  subtotal: number; // tổng tiền đơn hàng (chưa giảm)
  items?: {
    productId?: number;
    categoryId?: number | null;
    brandId?: number | null;
    price?: number;
    qty?: number;
  }[];
};

function toNumber(d: any): number {
  if (d == null) return 0;
  if (typeof d === "number") return d;
  if (typeof d === "string") return parseFloat(d);
  if (typeof d.toNumber === "function") return d.toNumber();
  return Number(d);
}

function calcDiscount(coupon: any, subtotal: number): number {
  const value = toNumber(coupon.value);
  if (coupon.type === CouponType.fixed) {
    return value;
  }
  if (coupon.type === CouponType.percentage) {
    // ví dụ value = 10 => giảm 10%
    return Math.floor((subtotal * value) / 100);
  }
  return 0;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ApplyBestBody;
    const { subtotal, items } = body;

    if (!subtotal || subtotal <= 0) {
      return NextResponse.json(
        { error: "subtotal is required and must be > 0" },
        { status: 400 }
      );
    }

    const now = new Date();

    const coupons = await prisma.coupon.findMany({
      where: {
        status: AccountStatus.active,
      },
    });

    if (!coupons.length) {
      return NextResponse.json({
        appliedCoupon: null,
        allCoupons: [],
        finalTotal: subtotal,
      });
    }

    const validCoupons = coupons.filter((c) => {
      // thời gian hiệu lực
      if (c.startsAt && c.startsAt > now) return false;
      if (c.endsAt && c.endsAt < now) return false;

      // usage limit
      if (c.usageLimit != null && c.used >= c.usageLimit) return false;

      const minOrder = toNumber(c.minOrder);
      const maxOrder = c.maxOrder ? toNumber(c.maxOrder) : 0;

      if (subtotal < minOrder) return false;
      if (maxOrder > 0 && subtotal > maxOrder) return false;

      // lọc theo category
      if (c.categoryId) {
        if (!items || items.length === 0) return false;
        const matchedCategory = items.some(
          (it) => it.categoryId === c.categoryId
        );
        if (!matchedCategory) return false;
      }

      // lọc theo brand
      if (c.brandId) {
        if (!items || items.length === 0) return false;
        const matchedBrand = items.some((it) => it.brandId === c.brandId);
        if (!matchedBrand) return false;
      }

      return true;
    });

    if (!validCoupons.length) {
      return NextResponse.json({
        appliedCoupon: null,
        allCoupons: [],
        finalTotal: subtotal,
      });
    }

    // ✅ build list tất cả coupon hợp lệ kèm discountAmount
    const allCoupons = validCoupons.map((c) => {
      const discountAmount = calcDiscount(c, subtotal);
      return {
        id: c.id,
        code: c.code,
        type: c.type,
        value: toNumber(c.value),
        discountAmount,
      };
    });

    // ✅ tìm coupon giảm nhiều nhất trong allCoupons
    let bestCoupon: any = null;
    let bestDiscount = 0;

    for (const c of allCoupons) {
      if (c.discountAmount > bestDiscount) {
        bestDiscount = c.discountAmount;
        bestCoupon = c;
      }
    }

    const finalTotal = Math.max(subtotal - bestDiscount, 0);

    return NextResponse.json({
      appliedCoupon: bestCoupon,
      allCoupons, // 👈 trả về full list
      finalTotal,
    });
  } catch (error) {
    console.error("POST /api/coupons/apply-best error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
