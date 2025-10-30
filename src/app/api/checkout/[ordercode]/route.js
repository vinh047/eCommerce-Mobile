import { NextResponse } from "next/server";
// Nếu chưa có alias "@", đổi import này thành: "../../../../lib/prisma"
import { prisma } from "@/lib/prisma";

async function getUserIdFromSession() {
  // Khớp với seed trong database.sql: ORD002 thuộc user_id = 2 (Bob)
  return 2;
}

// GET /api/checkout/[orderCode]
export async function GET(_req, { params }) {
  try {
    const userId = await getUserIdFromSession();
    const { orderCode } = params;

    const order = await prisma.order.findFirst({
      where: { code: orderCode, userId, status: "pending" },
      select: {
        id: true,
        code: true,
        status: true,
        subtotal: true,
        discount: true,
        shippingFee: true,
        total: true,
      },
    });
    if (!order)
      return NextResponse.json(
        { error: "Không tìm thấy đơn hàng hoặc trạng thái không hợp lệ." },
        { status: 404 }
      );

    const items = await prisma.orderItem.findMany({
      where: { orderId: order.id },
      select: {
        id: true,
        variantId: true,
        price: true,
        quantity: true,
        nameSnapshot: true,
      },
    });

    const addresses = await prisma.address.findMany({
      where: { userId },
      select: {
        id: true,
        line: true,
        ward: true,
        district: true,
        province: true,
        phone: true,
        isDefault: true,
      },
    });

    return NextResponse.json({
      code: order.code,
      status: order.status,
      subtotal: Number(order.subtotal),
      discount: Number(order.discount || 0),
      shipping_fee: Number(order.shippingFee || 0), // chuẩn hóa key cho UI
      total: Number(order.total),
      order_items: items.map((it) => ({
        id: it.id,
        variant_id: it.variantId,
        quantity: it.quantity,
        price: Number(it.price),
        name_snapshot: it.nameSnapshot,
      })),
      user: {
        addresses: addresses.map((a) => ({ ...a, is_default: a.isDefault })),
      },
    });
  } catch (error) {
    console.error("GET /api/checkout/[orderCode] error:", error);
    return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}

// PUT /api/checkout/[orderCode]
export async function PUT(req, { params }) {
  try {
    const userId = await getUserIdFromSession();
    const { orderCode } = params;
    const { addressId, paymentMethod } = await req.json();

    if (!addressId || !paymentMethod)
      return NextResponse.json({ error: "Thiếu thông tin" }, { status: 400 });

    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });
    if (!address)
      return NextResponse.json(
        { error: "Địa chỉ không hợp lệ" },
        { status: 404 }
      );

    const pending = await prisma.order.findFirst({
      where: { code: orderCode, userId, status: "pending" },
      select: { id: true, code: true },
    });
    if (!pending)
      return NextResponse.json(
        { error: "Đơn hàng không hợp lệ hoặc đã được xử lý" },
        { status: 404 }
      );

    const updated = await prisma.$transaction(async (tx) => {
      const items = await tx.orderItem.findMany({
        where: { orderId: pending.id },
        select: { variantId: true, quantity: true },
      });

      for (const it of items) {
        const res = await tx.variant.updateMany({
          where: { id: it.variantId, stock: { gte: it.quantity } },
          data: { stock: { decrement: it.quantity } },
        });
        if (res.count === 0) {
          const v = await tx.variant.findUnique({
            where: { id: it.variantId },
            include: { product: true },
          });
          throw new Error(
            `Sản phẩm "${
              v?.product?.name || it.variantId
            }" đã hết hàng hoặc không đủ số lượng.`
          );
        }
      }

      return tx.order.update({
        where: { id: pending.id },
        data: {
          status: "confirmed",
          paymentMethod,
          paymentStatus: paymentMethod === "COD" ? "pending" : "paid",
          addressSnapshot: {
            line: address.line,
            phone: address.phone,
            ward: address.ward,
            district: address.district,
            province: address.province,
          },
        },
        select: { code: true },
      });
    });

    return NextResponse.json({
      message: "Đặt hàng thành công",
      orderCode: updated.code,
    });
  } catch (error) {
    console.error("PUT /api/checkout/[orderCode] error:", error);
    if (error.message?.includes("hết hàng"))
      return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}
