import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Đảm bảo đường dẫn này đúng

async function getUserIdFromSession() {
  return 1; // TODO: thay bằng auth thật (Giả lập user 1)
}

export async function GET(request) {
  try {
    const userId = await getUserIdFromSession(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Dùng findUnique (vì userId là @unique trong schema)
    const cart = await prisma.cart.findUnique({
      where: {
        userId: userId,
      },
      include: {
        items: {
          // Yêu cầu DB chỉ gửi về item nào có variant và product active
          where: {
            variant: {
              isActive: true,
              product: {
                isActive: true,
              },
            },
          },
          // 3. Lấy dữ liệu lồng nhau
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    // 4. Chuẩn bị giỏ hàng rỗng
    const empty = { items: [], coupon: null, discount: 0, shipping: 20000 };

    // Nếu không có giỏ hàng, HOẶC giỏ hàng không có item (vì bị lọc hết)
    if (!cart || !cart.items || cart.items.length === 0) {
      return NextResponse.json(empty, { status: 200 });
    }

    // 5. Chỉ cần map (vì đã lọc ở bước 2)
    const items = cart.items.map((ci) => {
      const v = ci.variant;
      const p = v.product;

      const parts = [];
      if (v.color) parts.push(v.color);

      const specs = v.specsJson || p.specsJson;

      if (specs && typeof specs === "object") {
        if (specs.storage) parts.push(specs.storage);
        if (specs.ram) parts.push(specs.ram);
      }

      return {
        id: v.id,
        name: p.name,
        slug: p.slug,
        variant: parts.join(", "),
        price: Number(v.price),
        quantity: ci.quantity,
      };
    });

    // 7. Trả về kết quả
    return NextResponse.json(
      {
        items: items,
        coupon: null, // Tạm thời null vì chưa có quan hệ

        discount: Number(cart.discount || 0),

        shipping: 20000, // (Lấy 'shipping' từ code của bạn)
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Lỗi API (GET /api/cart):", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
