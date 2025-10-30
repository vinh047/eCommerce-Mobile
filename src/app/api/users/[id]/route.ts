import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

//GET - lấy 1 user theo id
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(params.id),
      NOT: {
        status: "deleted",
      },
    },
    include: { addresses: true },
  });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: Number } }
) {
  const { id } = params;
  const data = await req.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Failed to update user" },
      { status: 500 }
    );
  }
}

//PATCH - cập nhật user hoặc đổi trạng thái
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();

    const updated = await prisma.user.update({
      where: { id: Number(params.id) },
      data: {
        name: data.name,
        avatar: data.avatar,
        status: data.status,
      },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

//DELETE - xóa user
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.user.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
