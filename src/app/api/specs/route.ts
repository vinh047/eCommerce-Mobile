import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    // Tạo template cơ bản, version mặc định là 1
    const spec = await prisma.specTemplate.create({
      data: {
        name: data.name,
        categoryId: Number(data.categoryId),
        isActive: data.isActive ?? true,
        version: 1,
      },
    });
    return NextResponse.json(spec, { status: 201 });
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
    const categoryId = searchParams.get("categoryId");
    const isActiveParam = searchParams.get("isActive");

    const where: any = {};
    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }
    if (categoryId) {
      where.categoryId = Number(categoryId);
    }
    if (isActiveParam !== null && isActiveParam !== "") {
      where.isActive = isActiveParam === "true";
    }

    const totalItems = await prisma.specTemplate.count({ where });
    const data = await prisma.specTemplate.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { id: "desc" },
      include: {
        category: { select: { id: true, name: true } },
        productSpecs: {
          include: {
            options: true,
            buckets: true,
            productSpecValues: true,
          },
        },
        variantSpecs: {
          include: {
            options: true,
            buckets: true,
            variantSpecValues: true,
          },
        },
        _count: { select: { productSpecs: true } },
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
