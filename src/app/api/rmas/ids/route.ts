import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const type = searchParams.get("type") || "";

    const where: any = {};

    if (search) {
      where.order = {
        code: { contains: search, mode: "insensitive" }
      };
    }
    if (status) where.status = status;
    if (type) where.type = type;

    const rmas = await prisma.rma.findMany({
      where,
      select: { id: true },
    });

    return NextResponse.json({ ids: rmas.map((r: any) => r.id) });
  } catch (error) {
    console.error("Error fetching RMA IDs:", error);
    return NextResponse.json({ message: "Failed to get IDs" }, { status: 500 });
  }
}