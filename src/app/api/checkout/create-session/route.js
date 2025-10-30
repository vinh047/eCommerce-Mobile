import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { nanoid } from "nanoid";

async function getUserIdFromSession() {
  return 1;
}
function generateOrderCode() {
  return `ORD-${nanoid(8).toUpperCase()}`;
}

export async function POST() {
  try {
    const userId = await getUserIdFromSession();
    if (!userId)
      return NextResponse.json({ error: "Chưa xác thực" }, { status: 401 });

    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: { variant: { include: { product: true } } },
        },
      },
    });

    const cartItems = Array.isArray(cart?.items) ? cart.items : [];
    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Giỏ hàng trống" }, { status: 400 });
    }

    const orderItemsData = cartItems
      .filter((ci) => {
        const v = ci.variant;
        const p = v?.product;
        const vActive = (v?.isActive ?? v?.is_active ?? true) === true;
        const pActive = (p?.isActive ?? p?.is_active ?? true) === true;
        return vActive && pActive;
      })
      .map((ci) => {
        const v = ci.variant;
        const p = v.product;
        const parts = [];
        if (v?.color) parts.push(v.color);
        const specs = v?.specsJson || p?.specsJson || {};
        if (specs?.storage) parts.push(specs.storage);
        if (specs?.ram) parts.push(specs.ram);
        return {
          variantId: v.id,
          quantity: ci.quantity,
          price: Number(v.price),
          nameSnapshot: `${p.name}${
            parts.length ? ` (${parts.join(", ")})` : ""
          }`,
        };
      });

    if (orderItemsData.length === 0) {
      return NextResponse.json(
        { error: "Tất cả sản phẩm trong giỏ không khả dụng" },
        { status: 400 }
      );
    }

    const subtotal = orderItemsData.reduce(
      (t, it) => t + it.price * it.quantity,
      0
    );
    const discount = Number(cart?.discount || 0);
    const shippingFee = 20000;
    const total = subtotal - discount + shippingFee;
    const code = generateOrderCode();

    await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          code,
          status: "pending",
          paymentStatus: "pending",
          paymentMethod: null,
          discount,
          shippingFee,
          subtotal,
          total,
        },
        select: { id: true },
      });

      await tx.orderItem.createMany({
        data: orderItemsData.map((it) => ({
          orderId: order.id,
          variantId: it.variantId,
          price: it.price,
          quantity: it.quantity,
          nameSnapshot: it.nameSnapshot,
        })),
      });

      // Dọn giỏ hàng
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      // (tuỳ chọn) reset discount trong giỏ
      await tx.cart.update({ where: { id: cart.id }, data: { discount: 0 } });
    });

    return NextResponse.json(
      { orderCode: code, checkoutUrl: `/checkout/${code}` },
      { status: 200 }
    );
  } catch (e) {
    console.error("POST /api/checkout/create-session error:", e);
    return NextResponse.json(
      { error: "Không tạo được phiên thanh toán" },
      { status: 500 }
    );
  }
}
