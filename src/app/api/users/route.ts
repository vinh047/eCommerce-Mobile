import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

//GET - lấy toàn bộ user (trừ user bị xóa)
export async function GET() {
  const users = await prisma.user.findMany({
    where: {
      NOT: {
        status: "deleted",
      },
    },
    include: { addresses: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(users);
}

//POST - tạo user mới
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        name: data.name,
        avatar: data.avatar,
      },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
