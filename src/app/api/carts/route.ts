import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// GET - Lấy danh sách Cart (Phân trang, Tìm kiếm, Sắp xếp)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // 1. Params cơ bản
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "";

    // 2. Sắp xếp
    let sortBy = "createdAt"; // Mặc định sắp xếp theo ngày tạo
    let sortOrder: "asc" | "desc" = "desc";

    if (sort) {
      const [column, direction] = sort.split(":");
      // Chỉ cho phép sort các cột an toàn
      if (["id", "createdAt", "updatedAt"].includes(column)) {
        sortBy = column;
      }
      sortOrder = direction === "asc" ? "asc" : "desc";
    }

    // 3. Điều kiện lọc (Where)
    const where: Prisma.CartWhereInput = {};

    if (search) {
      // Tìm theo tên hoặc email của User sở hữu cart
      where.user = {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    // 4. Query Database
    const totalItems = await prisma.cart.count({ where });

    const data = await prisma.cart.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortBy]: sortOrder },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        items: {
          select: { id: true }, // Chỉ lấy ID để đếm số lượng items cho nhẹ
        },
      },
    });

    // Map lại dữ liệu để FE dễ hiển thị (ví dụ: thêm itemsCount)
    const formattedData = data.map((cart: any) => ({
      ...cart,
      itemsCount: cart.items.length,
    }));

    return NextResponse.json({
      data: formattedData,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      },
      filters: {
        search,
      },
    });
  } catch (err: any) {
    console.error("Error fetching carts:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}