import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { ids, action } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No IDs provided" }, { status: 400 });
    }

    const numericIds = ids.map((id: any) => Number(id));

    switch (action) {
      case "delete":
        await prisma.product.deleteMany({
          where: { id: { in: numericIds } },
        });
        break;

      case "active":
        await prisma.product.updateMany({
          where: { id: { in: numericIds } },
          data: { isActive: true },
        });
        break;

      case "inactive":
        await prisma.product.updateMany({
          where: { id: { in: numericIds } },
          data: { isActive: false },
        });
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}