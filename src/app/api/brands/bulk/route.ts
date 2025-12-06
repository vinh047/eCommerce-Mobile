import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { ids, action } = await req.json();

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "Invalid IDs" }, { status: 400 });
  }

  try {
    if (action === "delete") {
      // Soft delete thay vì deleteMany
      await prisma.brand.updateMany({
        where: { id: { in: ids }, isDeleted: false },
        data: { isDeleted: true },
      });
    } else if (action === "active") {
      await prisma.brand.updateMany({
        where: { id: { in: ids } },
        data: { isActive: true },
      });
    } else if (action === "inactive") {
      await prisma.brand.updateMany({
        where: { id: { in: ids } },
        data: { isActive: false },
      });
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Bulk update error:", error);

    if (error.code === "P2003") {
      return NextResponse.json(
        { message: "Không thể xóa một số thương hiệu vì đang chứa sản phẩm." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Bulk update failed", error: error.message },
      { status: 500 }
    );
  }
}
