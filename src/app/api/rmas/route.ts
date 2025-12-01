import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RmaStatus, RmaType } from "@prisma/client";

// GET: Lấy danh sách RMA (Giữ nguyên code cũ)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const type = searchParams.get("type") || "";

    const sort = searchParams.get("sort") || "";
    let sortBy = "createdAt";
    let sortOrder: "asc" | "desc" = "desc";

    if (sort) {
      const [column, direction] = sort.split(":");
      if (["id", "status", "createdAt", "type"].includes(column)) {
        sortBy = column;
        sortOrder = direction === "asc" ? "asc" : "desc";
      }
    }

    const where: any = {};
    if (search) {
      where.order = { code: { contains: search, mode: "insensitive" } };
    }
    if (status) where.status = status;
    if (type) where.type = type;

    const totalItems = await prisma.rma.count({ where });
    const data = await prisma.rma.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortBy]: sortOrder },
      include: {
        order: { select: { id: true, code: true, userId: true } },
        orderItem: { select: { id: true, nameSnapshot: true, price: true } },
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

// [MỚI] POST: Tạo RMA
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, orderItemId, type, reason, evidenceJson } = body;

    // 1. Validate
    if (!orderId || !orderItemId || !type || !reason) {
      return NextResponse.json(
        {
          error: "Thiếu thông tin bắt buộc (Đơn hàng, Sản phẩm, Loại, Lý do).",
        },
        { status: 400 }
      );
    }

    // 2. Check OrderItem ownership
    const validItem = await prisma.orderItem.findFirst({
      where: { id: Number(orderItemId), orderId: Number(orderId) },
    });

    if (!validItem) {
      return NextResponse.json(
        { error: "Sản phẩm không thuộc đơn hàng này." },
        { status: 400 }
      );
    }

    // 3. Check Duplicate (tránh spam rma cho cùng 1 item đang pending)
    const existingRma = await prisma.rma.findFirst({
      where: {
        orderItemId: Number(orderItemId),
        status: { in: [RmaStatus.pending, RmaStatus.approved] },
      },
    });

    if (existingRma) {
      return NextResponse.json(
        { error: "Sản phẩm này đang có yêu cầu RMA chờ xử lý." },
        { status: 409 }
      );
    }

    // 4. Create
    const newRma = await prisma.rma.create({
      data: {
        orderId: Number(orderId),
        orderItemId: Number(orderItemId),
        type: type as RmaType,
        reason,
        evidenceJson: evidenceJson || [],
        status: RmaStatus.pending,
      },
      include: {
        order: { select: { code: true } },
        orderItem: { select: { nameSnapshot: true } },
      },
    });

    return NextResponse.json(newRma, { status: 201 });
  } catch (err: any) {
    console.error("Error creating RMA:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
