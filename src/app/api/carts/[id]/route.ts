import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Lấy chi tiết 1 Cart theo ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const cart = await prisma.cart.findUnique({
      where: { id: numericId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        items: {
          include: {
            variant: true, // Include variant để lấy tên sản phẩm
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    return NextResponse.json(cart);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Xóa giỏ hàng
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = parseInt(id);

    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Xóa cart (Prisma relation onDelete: Cascade sẽ tự xóa cartItems)
    await prisma.cart.delete({
      where: { id: numericId },
    });

    return NextResponse.json({ message: "Cart deleted successfully" });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to delete cart", details: err.message },
      { status: 500 }
    );
  }
}
