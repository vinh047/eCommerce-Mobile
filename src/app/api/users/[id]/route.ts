import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

// GET - Lấy 1 user theo id
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { addresses: true },
    });

    if (!user || user.status === "deleted") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Cập nhật toàn bộ thông tin user
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();
    const updateData: any = { ...data };

    // Nếu có password → hash và lưu vào passwordHash
    if (data.password) {
      const hashed = await bcrypt.hash(data.password, 10);
      updateData.passwordHash = hashed;
      delete updateData.password; // bỏ password để tránh ghi nhầm
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Failed to update user", error: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Cập nhật một phần thông tin (name, avatar, status)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const _ = await params;
    const data = await req.json();

    const updated = await prisma.user.update({
      where: { id: Number((await params).id) },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.avatar && { avatar: data.avatar }),
        ...(data.status && { status: data.status }),
      },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

//  DELETE - Xóa mềm user (đề xuất)
// Nếu muốn xóa hẳn trong DB, bật `forceDelete` trong body.
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const force = searchParams.get("force") === "true"; // ?force=true => xóa cứng

    if (force) {
      await prisma.user.delete({ where: { id: Number(id) } });
      return NextResponse.json({ message: "User permanently deleted" });
    }

    const deletedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { status: "deleted" },
    });

    return NextResponse.json({
      message: "User soft deleted",
      data: deletedUser,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
