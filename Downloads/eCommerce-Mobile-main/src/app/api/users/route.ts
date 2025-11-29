import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Tạo user mới
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        name: data.name,
        avatar: data.avatar,
      },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// GET - Lấy danh sách user (có phân trang, tìm kiếm, lọc)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Lấy params cơ bản
    const sort = searchParams.get("sort") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";
    const statusQuery = searchParams.get("statusQuery") || "";

    let sortBy = "id";
    let sortOrder: "asc" | "desc" = "desc";

    if (sort) {
      const [column, direction] = sort.split(":");
      sortBy = column || "id";
      sortOrder = direction === "asc" ? "asc" : "desc";
    }

    // ==========================================================
    // WHERE điều kiện lọc
    // ==========================================================
    const where: any = {
      NOT: { status: "deleted" }, // tránh lấy user bị xoá
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (statusQuery) {
      const statuses = statusQuery.split(",");
      where.status = { in: statuses };
    }

    // ==========================================================
    // QUERY dữ liệu
    // ==========================================================
    const totalItems = await prisma.user.count({ where });

    const data = await prisma.user.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortBy]: sortOrder },
      include: { addresses: true },
    });

    // ==========================================================
    // TRẢ VỀ KẾT QUẢ
    // ==========================================================
    return NextResponse.json({
      data,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      },
      filters: {
        search,
        statusQuery: statusQuery ? statusQuery.split(",") : [],
      },
    });
  } catch (err: any) {
    console.error("Error fetching users:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
