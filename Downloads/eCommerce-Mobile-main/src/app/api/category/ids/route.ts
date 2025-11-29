import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const isActiveParam = searchParams.get("isActive");

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }

    if (isActiveParam !== null && isActiveParam !== "") {
      where.isActive = isActiveParam === "true";
    }

    const categories = await prisma.category.findMany({
      where,
      select: { id: true },
    });

    return NextResponse.json({ ids: categories.map((c) => c.id) });
  } catch (error) {
    console.error("Error fetching category IDs:", error);
    return NextResponse.json({ message: "Failed to get IDs" }, { status: 500 });
  }
}
