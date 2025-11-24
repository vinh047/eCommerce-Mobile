import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { ids, action } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { message: "No IDs provided" },
        { status: 400 }
      );
    }

    if (action === "delete") {
      // Xóa nhiều giỏ hàng
      const result = await prisma.cart.deleteMany({
        where: { id: { in: ids } },
      });

      return NextResponse.json({
        success: true,
        message: `Deleted ${result.count} carts successfully`,
      });
    }

    return NextResponse.json(
      { message: "Invalid bulk action for carts" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Bulk cart update error:", error);
    return NextResponse.json(
      { message: "Bulk action failed", error: error.message },
      { status: 500 }
    );
  }
}