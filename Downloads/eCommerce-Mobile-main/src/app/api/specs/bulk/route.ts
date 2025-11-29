import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { ids, action } = await req.json();
  try {
    if (action === "delete") {
      await prisma.specTemplate.deleteMany({ where: { id: { in: ids } } });
    } else if (action === "active") {
      await prisma.specTemplate.updateMany({
        where: { id: { in: ids } },
        data: { isActive: true },
      });
    } else if (action === "inactive") {
      await prisma.specTemplate.updateMany({
        where: { id: { in: ids } },
        data: { isActive: false },
      });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}