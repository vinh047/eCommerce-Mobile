// src/app/api/cart/count/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    // Lấy JWT từ cookie "token"
    const token = req.cookies.get("token")?.value;

    // Nếu không có token -> coi như chưa đăng nhập => count = 0
    if (!token) {
      return NextResponse.json({ count: 0 }, { status: 200 });
    }

    // Verify token
    const payload = await verifyToken(token);
    if (!payload || !payload.id) {
      // Token không hợp lệ -> cũng trả count = 0
      return NextResponse.json({ count: 0 }, { status: 200 });
    }

    const userId = Number(payload.id);
    if (!userId || !Number.isFinite(userId)) {
      return NextResponse.json({ count: 0 }, { status: 200 });
    }

    // Lấy cart theo userId và tính tổng quantity
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    const count =
      cart?.items?.reduce(
        (sum: any, item: any) => sum + (Number(item.quantity) || 0),
        0
      ) || 0;

    return NextResponse.json({ count }, { status: 200 });
  } catch (err) {
    console.error("api/cart/count error:", err);
    // Lỗi server thì trả count=0 nhưng status 500 để log được
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
