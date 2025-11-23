import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Lấy danh sách Roles
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";
    
    // Sort logic
    const sort = searchParams.get("sort") || "";
    let sortBy = "createdAt";
    let sortOrder: "asc" | "desc" = "desc";

    if (sort) {
      const [column, direction] = sort.split(":");
      // Chỉ cho phép sort các trường có thực
      if (["id", "name", "createdAt"].includes(column)) {
        sortBy = column;
        sortOrder = direction === "asc" ? "asc" : "desc";
      }
    }

    // Filter Condition
    const where: any = {};
    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }

    // Query Data
    const totalItems = await prisma.role.count({ where });

    const data = await prisma.role.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortBy]: sortOrder },
      include: {
        rolePermissions: true, // Lấy chi tiết quyền để đếm ở Client nếu cần
        _count: {
          select: { 
            staffRoles: true,     // Đếm xem có bao nhiêu nhân viên dùng role này
            rolePermissions: true // Đếm số lượng quyền
          } 
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
    console.error("Error fetching roles:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Tạo Role mới + Gán Permissions
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, permissionIds } = body; // permissionIds là mảng [1, 2, 5...]

    if (!name) {
      return NextResponse.json({ error: "Role name is required" }, { status: 400 });
    }

    // Dùng transaction để đảm bảo cả Role và Permissions được tạo cùng lúc
    const newRole = await prisma.$transaction(async (tx) => {
      // 1. Tạo Role
      const role = await tx.role.create({
        data: { name },
      });

      // 2. Nếu có permissionIds, tạo bảng nối RolePermission
      if (permissionIds && Array.isArray(permissionIds) && permissionIds.length > 0) {
        const rolePermissionsData = permissionIds.map((permId: number) => ({
          roleId: role.id,
          permissionId: permId,
        }));

        await tx.rolePermission.createMany({
          data: rolePermissionsData,
        });
      }

      // 3. Trả về role kèm permissions vừa tạo
      return await tx.role.findUnique({
        where: { id: role.id },
        include: { rolePermissions: true },
      });
    });

    return NextResponse.json(newRole, { status: 201 });
  } catch (err: any) {
    // Handle duplicate name error (Prisma P2002)
    if (err.code === 'P2002') {
       return NextResponse.json({ error: "Tên vai trò đã tồn tại." }, { status: 409 });
    }
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}