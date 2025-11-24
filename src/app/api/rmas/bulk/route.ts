import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { ids, action } = await req.json();

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "No IDs provided" }, { status: 400 });
  }

  try {
    // Action: delete, approved, rejected, completed
    if (action === "delete") {
      await prisma.rma.deleteMany({
        where: { id: { in: ids } },
      });
      return NextResponse.json({ success: true, message: "Deleted successfully" });
    }

    // Các action cập nhật trạng thái
    if (["pending", "approved", "rejected", "completed"].includes(action)) {
        await prisma.rma.updateMany({
            where: { id: { in: ids } },
            data: { status: action },
        });
        return NextResponse.json({ success: true, message: `Bulk update status to ${action} successful` });
    }

    return NextResponse.json({ error: "Action not supported" }, { status: 400 });
  } catch (error: any) {
    console.error("Bulk RMA action error:", error);
    return NextResponse.json(
      { message: "Bulk action failed", error: error.message },
      { status: 500 }
    );
  }
}