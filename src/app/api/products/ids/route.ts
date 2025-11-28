import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId");
    const isActive = searchParams.get("isActive");

    const where: any = {};

    // ----- SEARCH -----
    if (search) {
      const searchNum = parseInt(search);

      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];

      if (!isNaN(searchNum)) {
        where.OR.push({ id: searchNum });
      }
    }

    // ----- CATEGORY -----
    if (categoryId) {
      where.categoryId = Number(categoryId);
    }

    // ----- ACTIVE -----
    if (isActive) {
      where.isActive = isActive === "true";
    }

    // ----- QUERY DB -----
    const products = await prisma.product.findMany({
      where,
      select: { id: true },
    });

    return NextResponse.json({
      ids: products.map((p) => p.id),
    });
  } catch (error) {
    console.error("Product IDs error:", error);
    return NextResponse.json({ message: "Failed to get IDs" }, { status: 500 });
  }
}
