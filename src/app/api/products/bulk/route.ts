import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId");
    const isActive = searchParams.get("isActive");

    const where: any = {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { slug: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},

        categoryId ? { categoryId: Number(categoryId) } : {},

        isActive !== null ? { isActive: isActive === "true" } : {},
      ],
    };

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { id: true, name: true } },
        brand: { select: { id: true, name: true } },
        variants: {
          select: {
            id: true,
            color: true,
            price: true,
            stock: true,
            isActive: true,
          },
        },
      },
    });

    return NextResponse.json({ data: products });
  } catch (error) {
    console.error("GET All Products Error:", error);
    return NextResponse.json(
      { message: "Failed to get full product data" },
      { status: 500 }
    );
  }
}

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
