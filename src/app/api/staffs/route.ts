import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
// GET: Lấy danh sách Staff
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";
    const statusQuery = searchParams.get("statusQuery") || "";
    
    // Sort logic
    const sort = searchParams.get("sort") || "";
    let sortBy = "createdAt";
    let sortOrder: "asc" | "desc" = "desc";

    if (sort) {
      const [column, direction] = sort.split(":");
      if (["id", "name", "email", "status", "createdAt"].includes(column)) {
        sortBy = column;
        sortOrder = direction === "asc" ? "asc" : "desc";
      }
    }

    // Filter Condition
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        // Nếu id là số thì search string không work trực tiếp, bỏ qua hoặc xử lý riêng
      ];
    }

    if (statusQuery) {
      const statuses = statusQuery.split(",");
      // Ép kiểu về Enum nếu cần thiết, hoặc Prisma tự hiểu string nếu khớp
      where.status = { in: statuses };
    }

    // Query Data
    const totalItems = await prisma.staff.count({ where });

    const data = await prisma.staff.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortBy]: sortOrder },
      include: {
        staffRoles: {
          include: { role: true } // Include Role để hiển thị tên Role ở bảng
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
    console.error("Error fetching staffs:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Tạo Staff mới
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, status, avatar, roleIds } = body;

    // Validate cơ bản
    if (!email || !password) {
      return NextResponse.json({ error: "Email và mật khẩu là bắt buộc." }, { status: 400 });
    }

    // TODO: Hash password ở đây trước khi lưu (ví dụ dùng bcrypt)
    // const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPassword = password; // Demo: lưu plain text (KHÔNG NÊN dùng ở prod)

    // Dùng transaction để tạo Staff và gán Roles cùng lúc
    const newStaff = await prisma.$transaction(async (tx) => {
      // 1. Tạo Staff
      const staff = await tx.staff.create({
        data: {
          name,
          email,
          passwordHash: hashedPassword,
          status: status || 'active',
          avatar,
        },
      });

      // 2. Tạo StaffRoles nếu có roleIds
      if (roleIds && Array.isArray(roleIds) && roleIds.length > 0) {
        await tx.staffRole.createMany({
          data: roleIds.map((roleId: number) => ({
            staffId: staff.id,
            roleId: roleId,
          })),
        });
      }

      return await tx.staff.findUnique({
        where: { id: staff.id },
        include: { staffRoles: { include: { role: true } } },
      });
    });

    return NextResponse.json(newStaff, { status: 201 });
  } catch (err: any) {
    // Handle duplicate email
    if (err.code === 'P2002') {
       return NextResponse.json({ error: "Email này đã được sử dụng." }, { status: 409 });
    }
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}