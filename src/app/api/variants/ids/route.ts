import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const isActiveQuery = searchParams.get("isActive") || "";

    const where: any = {};
    if (search) {
       const searchNum = parseInt(search);
       where.OR = [
        { color: { contains: search, mode: "insensitive" } },
        { product: { name: { contains: search, mode: "insensitive" } } },
      ];
       if (!isNaN(searchNum)) where.OR.push({ id: searchNum });
    }
    if (isActiveQuery) {
      where.isActive = isActiveQuery === "true";
    }

    const variants = await prisma.variant.findMany({
      where,
      select: { id: true },
    });

    return NextResponse.json({ ids: variants.map((v) => v.id) });
  } catch (error) {
    return NextResponse.json({ message: "Failed to get IDs" }, { status: 500 });
  }
}