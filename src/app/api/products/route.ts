// app/api/products/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Lấy các params lọc
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId");
    const isActive = searchParams.get("isActive");

    const skip = (page - 1) * limit;

    // Xây dựng điều kiện lọc (Where clause)
    const where: any = {
      AND: [
        // Lọc theo tên
        search ? { name: { contains: search } } : {}, // Prisma mặc định case-insensitive với SQLite/Postgres mode cụ thể, check lại DB của bạn
        // Lọc theo danh mục
        categoryId ? { categoryId: Number(categoryId) } : {},
        // Lọc theo trạng thái
        isActive !== null ? { isActive: isActive === "true" } : {},
      ],
    };

    // Query Database
    // Chúng ta cần lấy variants để tính giá min-max và tổng stock
    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { name: true } },
          brand: { select: { name: true } },
          // Lấy variants để tính toán hiển thị
          variants: {
            select: {
              price: true,
              stock: true,
              isActive: true,
            },
          },
          // Lấy 1 ảnh đại diện (nếu có bảng Media liên kết, ở đây giả sử bạn có logic lấy ảnh thumbnail)
          // Nếu schema của bạn Media liên kết qua MediaVariant, query sẽ phức tạp hơn.
          // Tạm thời mình để placeholder, ta sẽ xử lý ảnh thumbnail sau.
        },
      }),
      prisma.product.count({ where }),
    ]);

    // Xử lý dữ liệu trước khi trả về (Tính Min/Max Price, Total Stock)
    const formattedProducts = products.map((p) => {
      const activeVariants = p.variants; // Hoặc filter .filter(v => v.isActive) tuỳ logic

      // Tính tổng tồn kho
      const totalStock = activeVariants.reduce(
        (sum, v) => sum + (v.stock || 0),
        0
      );

      // Tính khoảng giá
      let minPrice = 0;
      let maxPrice = 0;

      if (activeVariants.length > 0) {
        const prices = activeVariants
          .map((v) => Number(v.price))
          .filter((price) => price > 0);
        if (prices.length > 0) {
          minPrice = Math.min(...prices);
          maxPrice = Math.max(...prices);
        }
      }

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        categoryName: p.category?.name,
        brandName: p.brand?.name,
        isActive: p.isActive,
        totalStock,
        priceRange:
          minPrice === maxPrice ? minPrice : `${minPrice} - ${maxPrice}`, // Frontend tự format tiền tệ
        createdAt: p.createdAt,
        // image: ... logic lấy ảnh
      };
    });

    return NextResponse.json({
      data: formattedProducts,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("GET Products Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


