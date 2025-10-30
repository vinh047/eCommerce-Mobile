// src/app/api/users/bulk/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { ids, action } = await req.json();

  try {
    if (action === "delete") {
      await prisma.user.updateMany({
        where: { id: { in: ids } },
        data: { status: "deleted" },
      });
    } else if (action === "blocked") {
      await prisma.user.updateMany({
        where: { id: { in: ids } },
        data: { status: "blocked" },
      });
    } else if (action === "active") {
      await prisma.user.updateMany({
        where: { id: { in: ids } },
        data: { status: "active" },
      });
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
