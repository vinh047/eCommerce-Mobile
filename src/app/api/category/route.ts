import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const existing = await prisma.category.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return NextResponse.json({ error: "Slug đã tồn tại." }, { status: 400 });
    }

    const parentId = data.parentId ? Number(data.parentId) : null;

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        iconKey: data.iconKey || null,
        isActive: data.isActive ?? true,
        parentId: parentId,
      },
    });

    return NextResponse.json(category, { status: 201 });
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

    const totalItems = await prisma.category.count({ where });

    const data = await prisma.category.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortBy]: sortOrder },
      include: {
        parent: { select: { id: true, name: true } },
        _count: {
          select: { products: true, children: true },
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
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
