import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { ids, action } = await req.json();

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "No IDs provided" }, { status: 400 });
  }

  try {
    switch (action) {
      case "delete":
        // Xóa vĩnh viễn
        await prisma.review.deleteMany({
          where: { id: { in: ids } },
        });
        break;
        
      case "active":
        // Hiện đánh giá (Duyệt)
        await prisma.review.updateMany({
          where: { id: { in: ids } },
          data: { isActived: true },
        });
        break;

      case "inactive":
        // Ẩn đánh giá
        await prisma.review.updateMany({
          where: { id: { in: ids } },
          data: { isActived: false },
        });
        break;

      default:
        return NextResponse.json({ error: "Action not supported" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: `Bulk action ${action} successful` });
  } catch (error: any) {
    console.error("Bulk review action error:", error);
    return NextResponse.json(
      { message: "Bulk action failed", error: error.message },
      { status: 500 }
    );
  }
}