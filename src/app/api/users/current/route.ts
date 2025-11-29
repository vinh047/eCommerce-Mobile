import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: Vui lòng đăng nhập" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json(
        { message: "Unauthorized: Token không hợp lệ" },
        { status: 401 }
      );
    }

    const userId = Number(payload.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { addresses: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Không tìm thấy người dùng" },
        { status: 401 }
      );
    }

    // ====== TÍNH THỐNG KÊ ĐƠN HÀNG & REVIEW ======
    const [ordersAgg, reviewsCount] = await Promise.all([
      prisma.order.aggregate({
        where: { userId },
        _count: { _all: true },
        _sum: { total: true },
      }),
      prisma.review.count({
        where: { userId },
      }),
    ]);

    const totalOrders = ordersAgg._count._all ?? 0;
    const totalSpent = Number(ordersAgg._sum.total ?? 0);

    // GIỮ NGUYÊN CẤU TRÚC USER, CHỈ THÊM `stats`
    const responseBody = {
      ...user,
      stats: {
        totalOrders,
        totalSpent,
        totalReviews: reviewsCount,
      },
    };

    return NextResponse.json(responseBody);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    return NextResponse.json(
      { message: "Lỗi máy chủ. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
