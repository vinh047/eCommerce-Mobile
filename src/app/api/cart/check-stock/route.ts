// src/app/api/cart/check-stock/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: Vui lòng đăng nhập" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json(
        { message: "Unauthorized: Token không hợp lệ" },
        { status: 401 }
      );
    }

    const userId = Number(payload.id);
    const body = await req.json();
    const cartItemIds: number[] = body.cartItemIds || [];

    if (!Array.isArray(cartItemIds) || cartItemIds.length === 0) {
      return NextResponse.json(
        { message: "Danh sách cartItemIds không hợp lệ" },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          where: { id: { in: cartItemIds } },
          include: {
            variant: {
              include: {
                product: {
                  select: { name: true },
                },
                variantSpecValues: {
                  select: {
                    stringValue: true,
                    numericValue: true,
                    booleanValue: true,
                    unit: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json(
        { message: "Không tìm thấy giỏ hàng" },
        { status: 404 }
      );
    }

    const outOfStock: any[] = [];
    const notEnough: any[] = [];

    for (const item of cart.items) {
      const v = item.variant;
      if (!v) continue;

      const requested = item.quantity;
      const available = v.stock;

      // ===== BUILD PHẦN SPEC: "16 GB", "256 GB", ... =====
      const specParts =
        v.variantSpecValues?.map((sv: any) => {
          let value: string | null = null;

          if (sv.stringValue != null) {
            value = sv.stringValue;
          } else if (sv.numericValue != null) {
            value = sv.numericValue.toString();
          } else if (typeof sv.booleanValue === "boolean") {
            // Tuỳ bạn: "Có/Không" hoặc "Yes/No"
            value = sv.booleanValue ? "Có" : "Không";
          }

          if (!value) return null;
          return sv.unit ? `${value} ${sv.unit}` : value;
        }).filter(Boolean) as string[] ?? [];

      const specText = specParts.join(" / ");

      // ===== DISPLAY NAME: "Product - Color - 16 GB / ..." =====
      const displayName = [
        v.product?.name,
        v.color,
        specText,
      ]
        .filter(Boolean)
        .join(" - ");

      // ===== CHECK STOCK =====
      if (available <= 0) {
        outOfStock.push({
          cartItemId: item.id,
          variantId: v.id,
          requested,
          available,
          name: displayName,
        });
      } else if (available < requested) {
        notEnough.push({
          cartItemId: item.id,
          variantId: v.id,
          requested,
          available,
          name: displayName,
        });
      }
    }

    return NextResponse.json({
      ok: outOfStock.length === 0 && notEnough.length === 0,
      outOfStock,
      notEnough,
    });
  } catch (err) {
    console.error("check-stock error:", err);
    return NextResponse.json(
      { message: "Lỗi kiểm tra tồn kho" },
      { status: 500 }
    );
  }
}
