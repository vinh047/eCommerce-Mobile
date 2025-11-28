import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { ids, action } = await req.json();

  try {
    if (action === "delete") {
      await prisma.variant.deleteMany({
        where: { id: { in: ids } },
      });
    } else if (action === "inactive") {
      await prisma.variant.updateMany({
        where: { id: { in: ids } },
        data: { isActive: false },
      });
    } else if (action === "active") {
      await prisma.variant.updateMany({
        where: { id: { in: ids } },
        data: { isActive: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Bulk update error:", error);
    return NextResponse.json({ message: "Bulk update failed" }, { status: 500 });
  }
}