import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Sửa lại import đúng với dự án của bạn

export async function POST(req: Request) {
  const { ids, action } = await req.json();

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "No IDs provided" }, { status: 400 });
  }

  try {
    switch (action) {
      case "delete":
        await prisma.staff.deleteMany({
          where: { id: { in: ids } },
        });
        break;
        
      case "active":
      case "blocked":
      case "inactive":
        await prisma.staff.updateMany({
          where: { id: { in: ids } },
          data: { status: action },
        });
        break;

      default:
        return NextResponse.json({ error: "Action not supported" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: `Bulk action ${action} successful` });
  } catch (error: any) {
    console.error("Bulk staff action error:", error);
    return NextResponse.json(
      { message: "Bulk action failed", error: error.message },
      { status: 500 }
    );
  }
}