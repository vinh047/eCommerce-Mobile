import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Hành động hàng loạt (Bulk Action) cho Coupons
export async function POST(req: Request) {
  const { ids, action } = await req.json(); // ids là mảng các ID của coupon

  try {
    if (action === "delete") {
      // Xóa mềm hàng loạt
      await prisma.coupon.updateMany({
        where: { id: { in: ids } },
        data: { status: "deleted" },
      });
    } else if (action === "blocked") {
      // Block hàng loạt
      await prisma.coupon.updateMany({
        where: { id: { in: ids } },
        data: { status: "blocked" },
      });
    } else if (action === "active") {
      // Kích hoạt hàng loạt
      await prisma.coupon.updateMany({
        where: { id: { in: ids } },
        data: { status: "active" },
      });
    } else {
        return NextResponse.json({ message: "Invalid bulk action" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Bulk update error:", error);
    return NextResponse.json(
      { message: "Bulk update failed" },
      { status: 500 }
    );
  }
}