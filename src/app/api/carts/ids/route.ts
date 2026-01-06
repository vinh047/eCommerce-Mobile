import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const where: Prisma.CartWhereInput = {};

    // Tìm kiếm theo thông tin User sở hữu giỏ hàng
    if (search) {
      where.user = {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    const carts = await prisma.cart.findMany({
      where,
      select: { id: true },
    });

    return NextResponse.json({ ids: carts.map((c: any) => c.id) });
  } catch (error) {
    console.error("Error fetching cart IDs:", error);
    return NextResponse.json({ message: "Failed to get IDs" }, { status: 500 });
  }
}