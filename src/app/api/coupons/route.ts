import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Tạo Coupon mới
export async function POST(req: Request) {
  try {
    const data = await req.json();

    const coupon = await prisma.coupon.create({
      data: {
        code: data.code,
        type: data.type,
        value: data.value,
        minOrder: data.minOrder,
        startsAt: data.startsAt ? new Date(data.startsAt) : null,
        endsAt: data.endsAt ? new Date(data.endsAt) : null,
        usageLimit: data.usageLimit,
        status: data.status,
        categoryId: data.categoryId,
        brandId: data.brandId,
        maxOrder:data.maxOrder,
      },
    });
    return NextResponse.json(coupon, { status: 201 });
  } catch (err: any) {
    // Xử lý lỗi trùng code (unique constraint)
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "Mã giảm giá đã tồn tại." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// GET - Lấy danh sách Coupon (có phân trang, tìm kiếm, lọc)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";
    const statusQuery = searchParams.get("status") || "";
    const typeQuery = searchParams.get("type") || "";
    const sortBy = searchParams.get("sortBy") || "id";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const where: any = {
      NOT: { status: "deleted" },
    };

    if (search) {
      where.code = { contains: search, mode: "insensitive" };
    }

    if (statusQuery) {
      const statuses = statusQuery.split(",");
      where.status = { in: statuses };
    }

    if (typeQuery) {
      const types = typeQuery.split(",");
      where.type = { in: types };
    }

    const totalItems = await prisma.coupon.count({ where });
    const data = await prisma.coupon.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortBy]: sortOrder },
      include: {
        category: true,
        brand: true,
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
