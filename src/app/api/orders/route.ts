import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Lấy danh sách đơn hàng
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || ""; // Trạng thái đơn (pending, completed...)
    const paymentStatus = searchParams.get("paymentStatus") || ""; // Trạng thái thanh toán

    // Sort logic
    const sort = searchParams.get("sort") || "";
    let sortBy = "createdAt";
    let sortOrder: "asc" | "desc" = "desc";

    if (sort) {
      const [column, direction] = sort.split(":");
      if (["id", "code", "total", "status", "createdAt"].includes(column)) {
        sortBy = column;
        sortOrder = direction === "asc" ? "asc" : "desc";
      }
    }

    // Filter Condition
    const where: any = {};

    if (search) {
      where.OR = [
        { code: { contains: search, mode: "insensitive" } }, // Tìm theo mã đơn
        { user: { name: { contains: search, mode: "insensitive" } } }, // Tìm theo tên khách
        { user: { email: { contains: search, mode: "insensitive" } } }, // Tìm theo email khách
      ];
    }

    if (status) {
      where.status = status;
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }

    // Query Data
    const totalItems = await prisma.order.count({ where });

    const data = await prisma.order.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortBy]: sortOrder },
      include: {
        user: {
          select: { id: true, name: true, email: true }, // Chỉ lấy thông tin cần thiết của user
        },
        _count: {
          select: { items: true } // Đếm số lượng sản phẩm trong đơn
        }
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
    console.error("Error fetching orders:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Tạo đơn hàng mới
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      userId, 
      items, 
      note, 
      discount = 0, 
      shippingFee = 0,
      paymentStatus = 'pending',
      shippingStatus = 'pending',
      status = 'pending'
    } = body;

    if (!userId || !items || items.length === 0) {
      return NextResponse.json({ error: "Thiếu thông tin User hoặc Sản phẩm." }, { status: 400 });
    }

    // Tính toán lại tổng tiền để đảm bảo an toàn (Backend calculation)
    // Lưu ý: items phải chứa { variantId, price, quantity, nameSnapshot }
    const subtotal = items.reduce((sum: number, item: any) => sum + (Number(item.price) * Number(item.quantity)), 0);
    const total = subtotal + Number(shippingFee) - Number(discount);

    // Tạo mã đơn hàng ngẫu nhiên (VD: ORD-171569...)
    const code = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

    // Transaction: Tạo Order -> Tạo OrderItems
    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: Number(userId),
          code,
          status,
          paymentStatus,
          shippingStatus,
          note,
          subtotal,
          discount,
          shippingFee,
          total,
          // Tạo các items
          items: {
            create: items.map((item: any) => ({
              variantId: Number(item.variantId) || 1, // Fallback ID nếu test
              nameSnapshot: item.nameSnapshot,
              price: item.price,
              quantity: item.quantity,
            }))
          }
        },
        include: {
          items: true,
          user: true
        }
      });

      return order;
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (err: any) {
    console.error("Error creating order:", err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}