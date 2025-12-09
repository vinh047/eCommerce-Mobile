import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { ids, action } = await req.json();

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "No IDs provided" }, { status: 400 });
  }

  try {
    switch (action) {
      case "delete":
        // Xóa mềm nhiều item
        await prisma.banner.updateMany({
          where: { id: { in: ids } },
          data: { isDeleted: true },
        });
        break;
        
      case "active": // Hiện (isActive = true)
         await prisma.banner.updateMany({
          where: { id: { in: ids } },
          data: { isActive: true },
        });
        break;

      case "inactive": // Ẩn (isActive = false)
        await prisma.banner.updateMany({
          where: { id: { in: ids } },
          data: { isActive: false },
        });
        break;

      default:
        return NextResponse.json({ error: "Action not supported" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: `Bulk action ${action} successful` });
  } catch (error: any) {
    console.error("Bulk banner action error:", error);
    return NextResponse.json(
      { message: "Bulk action failed", error: error.message },
      { status: 500 }
    );
  }
}   