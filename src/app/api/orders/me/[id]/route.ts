import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = Number(id);
    const { searchParams } = new URL(req.url);
    const userId = Number(searchParams.get("userId"));

    if (!userId || isNaN(userId)) {
      return NextResponse.json(
        { message: "Missing or invalid userId" },
        { status: 400 }
      );
    }

    if (!orderId || isNaN(orderId)) {
      return NextResponse.json({ message: "Invalid orderId" }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: {
          include: {
            variant: {
              select: {
                id: true,
                productId: true,
                color: true,
                price: true,

                product: {
                  select: {
                    slug: true,
                  },
                },

                // Lấy ảnh
                MediaVariant: {
                  select: {
                    Media: {
                      select: { url: true },
                    },
                  },
                  orderBy: {
                    Media: { isPrimary: "desc" },
                  },
                  take: 1,
                },
              },
            },
            review: true,
          },
        },
        paymentAccount: {
          include: { paymentMethod: true },
        },
        transactions: {
          include: { paymentMethod: true },
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
    // Chuẩn hóa dữ liệu trả về
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
      addressSnapshot: order.addressSnapshot || {},

      items: order.items.map((item: any) => {
        const imageUrl = item.variant?.MediaVariant?.[0]?.Media?.url || null;
        const productSlug = item.variant?.product?.slug || null;

        return {
          id: item.id,
          nameSnapshot: item.nameSnapshot,
          quantity: item.quantity,
          price: item.price,

          slug: productSlug,
          image: imageUrl,
          variantColor: item.variant?.color || null,
          productId: item.variant?.productId || null,

          variant: {
            id: item.variant?.id ?? null,
            productId: item.variant?.productId ?? null,
            color: item.variant?.color ?? null,
            price: item.variant?.price ?? null,
          },

          review: item.review
            ? {
                id: item.review.id,
                stars: item.review.stars,
                content: item.review.content,
                createdAt: item.review.createdAt,
              }
            : null,
        };
      }),

      paymentInfo: order.paymentAccount
        ? {
            methodName: order.paymentAccount.paymentMethod?.name || null,
            methodCode: order.paymentAccount.paymentMethod?.code || null,
            bankName: order.paymentAccount.bankName,
            accountNumber: order.paymentAccount.accountNumber,
            accountName: order.paymentAccount.accountName,
          }
        : null,

      transactions: order.transactions.map((txn: any) => ({
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
