import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

//GET - lấy toàn bộ user (trừ user bị xóa)
// export async function GET() {
//   const users = await prisma.user.findMany({
//     where: {
//       NOT: {
//         status: "deleted",
//       },
//     },
//     include: { addresses: true },
//     orderBy: { createdAt: "desc" },
//   });

//   return NextResponse.json(users);
// }

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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status) {
    where.status = status;
  }

  const totalItems = await prisma.user.count({ where });

  const data = await prisma.user.findMany({
    where,
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { [sortBy]: sortOrder },
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
}

