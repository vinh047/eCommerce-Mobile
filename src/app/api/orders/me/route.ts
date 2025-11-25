import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    const userId = Number(payload?.id);

    if (!userId) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "5");

    const where = { userId };

    const totalItems = await prisma.order.count({ where });

    const orders = await prisma.order.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        code: true,
        status: true,
        paymentStatus: true,
        total: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      orders,
      meta: {
        page,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      },
    });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
