import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Tạo Quyền hạn mới
export async function POST(req: Request) {
  try {
    const data = await req.json();

    // 1. Dữ liệu cần thiết cho Permission
    const permission = await prisma.permission.create({
      data: {
        key: data.key,
        name: data.name,
        description: data.description,
      },
    });
    return NextResponse.json(permission, { status: 201 });
  } catch (err: any) {
    // 2. Xử lý lỗi trùng key (unique constraint P2002)
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "Key Quyền hạn đã tồn tại." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// GET - Lấy danh sách Quyền hạn (có phân trang, tìm kiếm, sắp xếp)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // 1. Lấy tham số phân trang & sắp xếp
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "id";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // 2. Xây dựng điều kiện lọc (where clause)
    const where: any = {};

    // Tìm kiếm theo Key hoặc Name
    if (search) {
      where.OR = [
        { key: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
      ];
    }

    // 3. Đếm tổng số lượng và lấy dữ liệu
    const totalItems = await prisma.permission.count({ where });
    const data = await prisma.permission.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortBy]: sortOrder },
      // Permission là đơn giản, không cần include quan hệ
    });

    // 4. Trả về kết quả
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
