import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.productId || !data.color || !data.price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const variant = await prisma.variant.create({
      data: {
        productId: data.productId,
        color: data.color,
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        stock: data.stock || 0,
        lowStockThreshold: data.lowStockThreshold,
        isActive: data.isActive ?? true,
      },
    });
    return NextResponse.json(variant, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const sort = searchParams.get("sort") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";
    const isActiveQuery = searchParams.get("isActive") || "";
    const stockStatus = searchParams.get("stockStatus") || "";

    let sortBy = "id";
    let sortOrder: "asc" | "desc" = "desc";

    if (sort) {
      const [column, direction] = sort.split(":");
      sortBy = column || "id";
      sortOrder = direction === "asc" ? "asc" : "desc";
    }

    const where: any = {};

    if (search) {
      const searchNum = parseInt(search);
      where.OR = [
        { color: { contains: search, mode: "insensitive" } },
        { product: { name: { contains: search, mode: "insensitive" } } },
      ];
      if (!isNaN(searchNum)) {
        where.OR.push({ id: searchNum });
      }
    }

    if (isActiveQuery) {
      where.isActive = isActiveQuery === "true";
    }

    if (stockStatus === "in_stock") {
      where.stock = { gt: 0 };
    } else if (stockStatus === "out_of_stock") {
      where.stock = { lte: 0 };
    } else if (stockStatus === "low_stock") {
      where.stock = { lte: 5, gt: 0 };
    }

    const totalItems = await prisma.variant.count({ where });

    const data = await prisma.variant.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortBy]: sortOrder },
      include: {
        product: { select: { name: true } },
        MediaVariant: {
          include: { Media: true },
   
        },
      },
    });

    return NextResponse.json({
      data,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      },
    });
  } catch (err: any) {
    console.error("Error fetching variants:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
