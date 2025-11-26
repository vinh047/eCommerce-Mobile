import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const staff = await prisma.staff.findUnique({
      where: { email },
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

    if (!staff) {
      return NextResponse.json(
        { error: "Tài khoản không tồn tại" },
        { status: 404 }
      );
    }

    const isValid = await bcrypt.compare(password, staff.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Sai mật khẩu" },
        { status: 401 }
      );
    }

    // Extract roles
    const roles = staff.staffRoles.map((r) => r.role.name);

    // Extract permissions
    const permissions = staff.staffRoles
      .flatMap((r) => r.role.rolePermissions)
      .map((rp) => rp.permission.key);

    // Create Staff JWT
    const token = await signToken({
      staffId: staff.id,
      email: staff.email,
      roles,
      permissions,
      isStaff: true,
    });

    const res = NextResponse.json({
      message: "Đăng nhập thành công",
      staff: {
        id: staff.id,
        email: staff.email,
        name: staff.name,
        roles,
        permissions,
      },
    });

    res.cookies.set("admin_token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 4, // 4h session
    });

    return res;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Lỗi hệ thống" },
      { status: 500 }
    );
  }
}
