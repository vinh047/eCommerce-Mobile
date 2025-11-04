import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// GET - Lấy 1 user theo id
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(params.id) },
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
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    const updatedUser = await prisma.user.update({
      where: { id: Number(params.id) },
      data,
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
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();

    const updated = await prisma.user.update({
      where: { id: Number(params.id) },
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
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const force = searchParams.get("force") === "true"; // ?force=true => xóa cứng

    if (force) {
      await prisma.user.delete({ where: { id: Number(params.id) } });
      return NextResponse.json({ message: "User permanently deleted" });
    }

    const deletedUser = await prisma.user.update({
      where: { id: Number(params.id) },
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
