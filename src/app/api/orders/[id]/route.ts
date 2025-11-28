import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = Number(id);
    const order = await prisma.order.findUnique({
      where: { id: numericId },
      include: {
        user: {
          select: { id: true, name: true, email: true, addresses: true },
        },
        items: {
          include: {
            variant: true,
          },
        },
        paymentAccount: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const {
      status,
      paymentStatus,
      shippingStatus,
      note,
      items,
      discount,
      shippingFee,
    } = body;

    const { id } = await params;
    const orderId = Number(id);

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const updateData: any = {
        status,
        paymentStatus,
        shippingStatus,
        note,
        discount,
        shippingFee,
      };

      if (items && Array.isArray(items) && items.length > 0) {
        await tx.orderItem.deleteMany({
          where: { orderId: orderId },
        });

        await tx.orderItem.createMany({
          data: items.map((item: any) => ({
            orderId: orderId,
            variantId: Number(item.variantId) || 1,
            nameSnapshot: item.nameSnapshot,
            price: item.price,
            quantity: item.quantity,
          })),
        });

        const subtotal = items.reduce(
          (sum: number, item: any) =>
            sum + Number(item.price) * Number(item.quantity),
          0
        );
        updateData.subtotal = subtotal;
        updateData.total =
          subtotal + Number(shippingFee || 0) - Number(discount || 0);
      } else if (discount !== undefined || shippingFee !== undefined) {
        const oldOrder = await tx.order.findUnique({ where: { id: orderId } });
        if (oldOrder) {
          const newDiscount =
            discount !== undefined
              ? Number(discount)
              : Number(oldOrder.discount);
          const newShipping =
            shippingFee !== undefined
              ? Number(shippingFee)
              : Number(oldOrder.shippingFee);
          updateData.total =
            Number(oldOrder.subtotal) + newShipping - newDiscount;
        }
      }

      return await tx.order.update({
        where: { id: orderId },
        data: updateData,
        include: { items: true },
      });
    });

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { message: "Failed to update order", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = Number(id);

    await prisma.order.delete({ where: { id: numericId } });
    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
