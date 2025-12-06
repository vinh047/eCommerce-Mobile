import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { ids, action } = await req.json();

  if (!ids || !Array.isArray(ids)) {
    return NextResponse.json({ error: "Invalid IDs" }, { status: 400 });
  }

  try {
    if (action === "delete") {
      // Thay deleteMany bằng updateMany để soft-delete
      // Giữ lại miền where: { id: { in: ids } } như cũ, 
      // thêm isDeleted: false để không lặp soft-delete lên những đã bị xóa trước đó
      await prisma.category.updateMany({
        where: { id: { in: ids }, isDeleted: false },
        data: { isDeleted: true },
      });
    } else if (action === "active") {
      await prisma.category.updateMany({
        where: { id: { in: ids } },
        data: { isActive: true },
      });
    } else if (action === "inactive") {
      await prisma.category.updateMany({
        where: { id: { in: ids } },
        data: { isActive: false },
      });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === "P2003") {
      return NextResponse.json(
        { message: "Một số danh mục không thể xóa do đang chứa sản phẩm." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Failed", error: error.message },
      { status: 500 }
    );
  }
}
