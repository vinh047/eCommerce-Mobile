import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth"; // bạn cần hàm verifyToken đối xứng với signToken

export async function GET(req: Request) {
  try {
    // Lấy cookie từ request
    const cookieHeader = req.headers.get("cookie");
    if (!cookieHeader) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const token = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("admin_token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Token không tồn tại" },
        { status: 401 }
      );
    }

    // Verify JWT
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Token không hợp lệ" },
        { status: 401 }
      );
    }

    // Lấy staff từ DB để đảm bảo dữ liệu mới nhất
    const staff = await prisma.staff.findUnique({
      where: { id: Number(payload.staffId) },
      include: {
        staffRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
      },
    });

    console.log("staff: ", staff)

    if (!staff) {
      return NextResponse.json(
        { error: "Không tìm thấy staff" },
        { status: 404 }
      );
    }

    const roles = staff.staffRoles.map((r) => r.role.name);
    const permissions = staff.staffRoles
      .flatMap((r) => r.role.rolePermissions)
      .map((rp) => rp.permission.key);

    return NextResponse.json({
      staff: {
        id: staff.id,
        email: staff.email,
        name: staff.name,
        roles,
        permissions,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}
