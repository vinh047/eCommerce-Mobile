import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Lấy danh sách Banner
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";
    const isActiveQuery = searchParams.get("isActive"); // 'true' | 'false'
    
    // Sort logic
    const sort = searchParams.get("sort") || "";
    let sortBy = "displayOrder"; // Mặc định sắp xếp theo thứ tự hiển thị
    let sortOrder: "asc" | "desc" = "asc"; // Mặc định tăng dần

    if (sort) {
      const [column, direction] = sort.split(":");
      if (["id", "altText", "displayOrder", "isActive", "createdAt"].includes(column)) {
        sortBy = column;
        sortOrder = direction === "asc" ? "asc" : "desc";
      }
    }

    // Filter Condition
    const where: any = {
        isDeleted: false // Luôn lọc bỏ item đã xóa mềm
    };
    
    if (search) {
      where.OR = [
        { altText: { contains: search, mode: "insensitive" } },
        { product: { name: { contains: search, mode: "insensitive" } } }, // Tìm theo tên sản phẩm
      ];
    }

    if (isActiveQuery) {
        where.isActive = isActiveQuery === 'true';
    }

    // Query Data
    const totalItems = await prisma.banner.count({ where });

    const data = await prisma.banner.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortBy]: sortOrder },
      include: {
        product: {
            select: { id: true, name: true } // Chỉ lấy thông tin cần thiết của Product
        } 
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
    console.error("Error fetching banners:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Tạo Banner mới
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { image, altText, isActive, displayOrder, productId } = body;

    // Validate
    if (!image || !productId) {
      return NextResponse.json({ error: "Hình ảnh và Sản phẩm là bắt buộc." }, { status: 400 });
    }

    const newBanner = await prisma.banner.create({
      data: {
        image,
        altText,
        isActive: isActive !== undefined ? isActive : true,
        displayOrder: displayOrder ? parseInt(displayOrder) : 0,
        productId: parseInt(productId),
      },
      include: {
          product: { select: { id: true, name: true } }
      }
    });

    return NextResponse.json(newBanner, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}