import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = Number(params.id);
    const { searchParams } = new URL(req.url);
    const userId = Number(searchParams.get("userId"));

    if (!userId || isNaN(userId)) {
      return NextResponse.json(
        { message: "Missing or invalid userId" },
        { status: 400 }
      );
    }

    if (!orderId || isNaN(orderId)) {
      return NextResponse.json(
        { message: "Invalid orderId" },
        { status: 400 }
      );
    }

    // Lấy order + Item + Variant + PaymentAccount + PaymentMethod
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: userId, // đảm bảo user chỉ xem đơn của mình
      },
      include: {
        items: {
          include: {
            variant: true,
          },
        },
        paymentAccount: {
          include: {
            paymentMethod: true,
          },
        },
        transactions: {
          include: {
            paymentMethod: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { message: "Order not found or not owned by this user" },
        { status: 404 }
      );
    }

    // ---------------------------
    // Chuẩn hóa dữ liệu trả về cho UI
    // ---------------------------

    const response = {
      id: order.id,
      code: order.code,
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      discount: order.discount,
      total: order.total,
      note: order.note,

      // ⭐ địa chỉ snapshot
      addressSnapshot: order.addressSnapshot || {},

      // ⭐ danh sách sản phẩm
      items: order.items.map((item) => ({
        id: item.id,
        nameSnapshot: item.nameSnapshot,
        price: item.price,
        quantity: item.quantity,
        variantColor: item.variant?.color || null,
      })),

      // ⭐ thanh toán (PaymentAccount)
      paymentInfo: order.paymentAccount
        ? {
            methodName: order.paymentAccount.paymentMethod?.name || null,
            methodCode: order.paymentAccount.paymentMethod?.code || null,
            bankName: order.paymentAccount.bankName || null,
            accountNumber: order.paymentAccount.accountNumber || null,
            accountName: order.paymentAccount.accountName || null,
          }
        : null,

      // ⭐ giao dịch thanh toán (PaymentTransaction)
      transactions: order.transactions.map((txn) => ({
        id: txn.id,
        amount: txn.amount,
        status: txn.status,
        providerPaymentId: txn.providerPaymentId,
        createdAt: txn.createdAt,
        methodName: txn.paymentMethod?.name || null,
        methodCode: txn.paymentMethod?.code || null,
      })),
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error fetching order detail:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
