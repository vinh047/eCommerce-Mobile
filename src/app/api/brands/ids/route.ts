import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const isActiveParam = searchParams.get("isActive");

    const where: any = { isDeleted: false };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }

    if (isActiveParam !== null && isActiveParam !== "") {
      where.isActive = isActiveParam === "true";
    }

    const brands = await prisma.brand.findMany({
      where,
      select: { id: true },
    });

    return NextResponse.json({ ids: brands.map((b: any) => b.id) });
  } catch (error) {
    console.error("Error fetching brand IDs:", error);
    return NextResponse.json({ message: "Failed to get IDs" }, { status: 500 });
  }
}
