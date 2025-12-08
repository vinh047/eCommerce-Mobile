import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// =========================
//  GET /api/reviews
// =========================
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") || 1);
    const pageSize = Number(searchParams.get("pageSize") || 10);
    const stars = searchParams.get("stars");
    const search = searchParams.get("search") || "";

    const where: any = {};

    if (stars) where.stars = Number(stars);

    if (search) {
      where.OR = [
        { content: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { product: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const totalItems = await prisma.review.count({ where });

    const data = await prisma.review.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
        product: { select: { id: true, name: true } },
      },
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
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// =========================
//  POST /api/reviews
// =========================
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, orderItemId, stars, content } = body;

    // ==============================
    // ❌ FIX 1 — Validate input
    // ==============================
    if (!productId || !orderItemId) {
      return NextResponse.json(
        { error: "Thiếu productId hoặc orderItemId" },
        { status: 400 }
      );
    }

    // Lấy orderItem + order để biết user
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
      include: {
        order: true,
        review: true, // ⭐ Quan trọng: Lấy review hiện có
      },
    });

    if (!orderItem) {
      return NextResponse.json(
        { error: "OrderItem không tồn tại" },
        { status: 404 }
      );
    }

    const userId = orderItem.order.userId;

    // ==============================
    // ❌ FIX 2 — Kiểm tra trạng thái đơn hàng
    // ==============================
    if (orderItem.order.status !== "completed") {
      return NextResponse.json(
        { error: "Đơn hàng chưa hoàn thành, không thể đánh giá" },
        { status: 400 }
      );
    }

    // ==============================
    // ❌ FIX 3 — Kiểm tra review đã tồn tại
    // ==============================
    if (orderItem.review) {
      return NextResponse.json(
        { error: "Bạn đã đánh giá sản phẩm này rồi" },
        { status: 400 }
      );
    }

    // ==============================
    // ⭐ Tạo review mới
    // ==============================
    const review = await prisma.review.create({
      data: {
        productId,
        userId,
        stars: Number(stars),
        content: content || "",
      },
    });

    // Gắn review vào orderItem
    await prisma.orderItem.update({
      where: { id: orderItemId },
      data: { reviewId: review.id },
    });

    return NextResponse.json({ success: true, review });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Lỗi khi tạo review: " + err.message },
      { status: 500 }
    );
  }
}
