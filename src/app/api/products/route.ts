// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
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
    const sort = searchParams.get("sort") || "";
    let sortBy = "id";
    let sortOrder: "asc" | "desc" = "desc";
    if (sort) {
      const [column, direction] = sort.split(":");
      sortBy = column || "id";
      sortOrder = direction === "asc" ? "asc" : "desc";
    }
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
        orderBy: { [sortBy]: sortOrder },
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      categoryId,
      brandId,
      description,
      specs,
      variants,
      isActive,
      slug,
    } = body;

    // Thực hiện Transaction
    const newProduct = await prisma.$transaction(async (tx) => {
      // 1. Tạo Product
      const product = await tx.product.create({
        data: {
          name,
          description,
          isActive: isActive ?? true, // Mặc định true nếu không có
          categoryId: Number(categoryId),
          brandId: Number(brandId),
          slug,
        },
      });

      const productId = product.id;

      // 2. Tạo Product Specs
      if (specs && specs.length > 0) {
        const specsToCreate = specs.map((s: any) => ({
          productId,
          specKey: s.specKey,
          label: s.label,
          type: s.type,
          unit: s.unit,
          stringValue: s.stringValue ?? "",
          numericValue: s.numericValue ? Number(s.numericValue) : null,
          booleanValue: s.booleanValue ?? null,
        }));
        await tx.productSpecValue.createMany({ data: specsToCreate });
      }

      // 3. Tạo Variants
      if (variants && variants.length > 0) {
        for (const v of variants) {
          // Chuẩn bị data cho Media (Nested Write)
          const mediaCreateData = Array.isArray(v.media)
            ? v.media.map((m: any) => ({
                Media: {
                  create: {
                    url: m.url,
                    isPrimary: m.isPrimary ?? false,
                    sortOrder: m.sortOrder ?? 0,
                  },
                },
              }))
            : [];

          // Chuẩn bị data cho Variant Specs (Nested Write)
          const specsCreateData = Array.isArray(v.variantSpecValues)
            ? v.variantSpecValues.map((s: any) => ({
                specKey: s.specKey,
                label: s.label || "",
                type: s.type || "",
                unit: s.unit || "",
                stringValue: s.stringValue || null,
                numericValue: s.numericValue || null,
                booleanValue: s.booleanValue || null,
              }))
            : [];

          // Tạo Variant (kèm Media và Specs con)
          await tx.variant.create({
            data: {
              productId, // Link với product vừa tạo ở bước 1
              color: v.color,
              price: Number(v.price),
              compareAtPrice: Number(v.compareAtPrice),
              stock: Number(v.stock),
              lowStockThreshold: Number(v.lowStockThreshold || 5),
              isActive: v.isActive ?? true,
              // Tạo lồng nhau luôn, không cần tách ra
              MediaVariant: {
                create: mediaCreateData,
              },
              variantSpecValues: {
                create: specsCreateData,
              },
            },
          });
        }
      }

      return product;
    });

    return NextResponse.json({ success: true, id: newProduct.id });
  } catch (error: any) {
    console.error("Create Product Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
