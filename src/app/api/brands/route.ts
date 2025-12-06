import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const existing = await prisma.brand.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Slug đã tồn tại, vui lòng chọn slug khác." },
        { status: 400 }
      );
    }

    const brand = await prisma.brand.create({
      data: {
        name: data.name,
        slug: data.slug,
        isActive: data.isActive ?? true,
      },
    });

    return NextResponse.json(brand, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";
    const isActiveParam = searchParams.get("isActive");
    const sort = searchParams.get("sort") || "";

    let sortBy = "id";
    let sortOrder: "asc" | "desc" = "desc";
    if (sort) {
      const [column, direction] = sort.split(":");

      if (["id", "name", "slug", "createdAt", "isActive"].includes(column)) {
        sortBy = column;
        sortOrder = direction === "asc" ? "asc" : "desc";
      }
    }

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

    const totalItems = await prisma.brand.count({ where });

    const data = await prisma.brand.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortBy]: sortOrder },
      include: {
        _count: {
          select: { products: true, coupons: true },
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
    console.error("Error fetching brands:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
