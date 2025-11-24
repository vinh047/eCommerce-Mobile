import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Lấy danh sách đánh giá
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";
    const stars = searchParams.get("stars"); // Lọc theo số sao (1-5)
    const status = searchParams.get("status"); // 'active' | 'inactive'

    // Sort logic
    const sort = searchParams.get("sort") || "";
    let sortBy = "createdAt";
    let sortOrder: "asc" | "desc" = "desc";

    if (sort) {
      const [column, direction] = sort.split(":");
      if (["id", "stars", "createdAt", "isActived"].includes(column)) {
        sortBy = column;
        sortOrder = direction === "asc" ? "asc" : "desc";
      }
    }

    // Filter Condition
    const where: any = {};

    if (search) {
      where.OR = [
        { content: { contains: search, mode: "insensitive" } }, // Tìm trong nội dung
        { user: { name: { contains: search, mode: "insensitive" } } }, // Tìm theo tên khách
        { product: { name: { contains: search, mode: "insensitive" } } }, // Tìm theo tên sản phẩm
      ];
    }

    if (stars) {
      where.stars = parseInt(stars);
    }

    if (status) {
      where.isActived = status === "active";
    }

    // Query Data
    const totalItems = await prisma.review.count({ where });

    const data = await prisma.review.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortBy]: sortOrder },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        product: {
          select: { id: true, name: true }, // Lấy tên sản phẩm để hiển thị
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
    console.error("Error fetching reviews:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}