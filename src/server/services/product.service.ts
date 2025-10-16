import { prisma } from "@/lib/prisma";
import {  Prisma, ValueType } from "@prisma/client";

export const productService = {
  async getProductsWithMinPriceByCategory(
    categoryId: string,
    limit: number = 10
  ) {
    const categoryIdNum = Number(categoryId);
    if (!Number.isFinite(categoryIdNum)) throw new Error("Invalid categoryId");

    const products = await prisma.product.findMany({
      where: { categoryId: categoryIdNum, isActive: true },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        variants: {
          where: { isActive: true },
          orderBy: { price: "asc" },
          take: 1,
          select: {
            id: true,
            price: true,
            Media: {
              where: { isPrimary: true },
              orderBy: [{ sortOrder: "asc" }],
              take: 1,
              select: { id: true, url: true, isPrimary: true },
            },
          },
        },
      },
    });

    return products.map((p) => {
      const cheapest = p.variants[0];
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        categoryId: p.categoryId,
        createdAt: p.createdAt,
        ratingAvg: p.ratingAvg,
        minPrice: cheapest?.price ?? null,
        image: cheapest?.Media?.[0]?.url ?? null,
        cheapestVariantId: cheapest?.id ?? null,
      };
    });
  },

  /**
   * Lấy danh sách sản phẩm dựa trên các bộ lọc (filters) từ query params.
   * Hỗ trợ lọc theo thuộc tính của Product và Variant, với cả 2 kiểu giá trị là 'discrete' và 'range'.
   *
   * @param categoryId - ID của danh mục sản phẩm.
   * @param filters - Object chứa các bộ lọc, ví dụ: { brand: 'apple', screen_size: '1,2', color: 'blue' }
   * - Đối với valueType='range', value là ID của bucket.
   * - Đối với valueType='discrete', value là giá trị thực tế.
   */
  async getProductsByFilters(
    categoryId: number,
    filters: Record<string, string>
  ) {
    // === BƯỚC 1: LẤY THÔNG TIN SPEC (Giữ nguyên) ===
    const specTemplate = await prisma.specTemplate.findFirst({
      where: { categoryId, isActive: true },
    });
    if (!specTemplate) {
      throw new Error(
        `Không tìm thấy Spec Template cho category ID: ${categoryId}`
      );
    }
    const [productSpecs, variantSpecs] = await Promise.all([
      prisma.productSpec.findMany({
        where: { specTemplateId: specTemplate.id, filterable: true },
      }),
      prisma.variantSpec.findMany({
        where: { specTemplateId: specTemplate.id, filterable: true },
      }),
    ]);
    const specInfoMap = new Map<
      string,
      { type: "product" | "variant"; valueType: ValueType }
    >();
    productSpecs.forEach((spec) =>
      specInfoMap.set(spec.code, { type: "product", valueType: spec.valueType })
    );
    variantSpecs.forEach((spec) =>
      specInfoMap.set(spec.code, { type: "variant", valueType: spec.valueType })
    );

    // === BƯỚC 2: XÂY DỰNG `WHERE`, `ORDER BY` VÀ LẤY THÔNG TIN PHÂN TRANG ===
    const whereClause: Prisma.ProductWhereInput = {
      categoryId: categoryId,
      isActive: true,
      AND: [],
    };

    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    let priceSortDirection: "asc" | "desc" | null = null;

    //  Mới: Xử lý page và limit
    const page = parseInt(filters.page || "1", 10);
    const limit = parseInt(filters.limit || "10", 10);
    const skip = (page - 1) * limit;

    const productSpecConditions: Prisma.ProductWhereInput[] = [];
    const variantSpecConditions: Prisma.VariantWhereInput[] = [];

    for (const key in filters) {
      const value = filters[key];
      if (!value) continue;

      // Bỏ qua page, limit trong vòng lặp chính
      if (key === "page" || key === "limit") {
        continue;
      }

      if (key === "sort") {
        switch (value) {
          case "latest":
            orderBy.createdAt = "desc";
            break;
          case "price-asc":
            priceSortDirection = "asc";
            break;
          case "price-desc":
            priceSortDirection = "desc";
            break;
        }
        continue;
      }

      // (Logic filter còn lại giữ nguyên)
      if (key === "brand") {
        whereClause.brand = { slug: { in: String(value).split(",") } };
        continue;
      }
      const specInfo = specInfoMap.get(key);
      if (!specInfo) continue;
      const filterValues = String(value).split(",");
      if (specInfo.valueType === "discrete") {
        const condition = { specKey: key, stringValue: { in: filterValues } };
        if (specInfo.type === "product") {
          productSpecConditions.push({
            productSpecValues: { some: condition },
          });
        } else {
          variantSpecConditions.push({
            variantSpecValues: { some: condition },
          });
        }
      } else if (specInfo.valueType === "range") {
        const bucketIds = filterValues
          .map((id) => parseInt(id, 10))
          .filter(Boolean);
        if (bucketIds.length === 0) continue;
        if (specInfo.type === "product") {
          const buckets = await prisma.productBucket.findMany({
            where: { id: { in: bucketIds } },
          });
          const rangeConditions = buckets.map((b) => ({
            numericValue: { gt: b.gt?.toNumber(), lte: b.lte?.toNumber() },
          }));
          if (rangeConditions.length > 0) {
            productSpecConditions.push({
              productSpecValues: {
                some: { specKey: key, OR: rangeConditions },
              },
            });
          }
        } else {
          const buckets = await prisma.variantBucket.findMany({
            where: { id: { in: bucketIds } },
          });
          const rangeConditions = buckets.map((b) => ({
            numericValue: { gt: b.gt?.toNumber(), lte: b.lte?.toNumber() },
          }));
          if (rangeConditions.length > 0) {
            variantSpecConditions.push({
              variantSpecValues: {
                some: { specKey: key, OR: rangeConditions },
              },
            });
          }
        }
      }
    }

    if (productSpecConditions.length > 0) {
      (whereClause.AND as Prisma.ProductWhereInput[]).push(
        ...productSpecConditions
      );
    }
    if (variantSpecConditions.length > 0) {
      (whereClause.AND as Prisma.ProductWhereInput[]).push({
        variants: { some: { AND: variantSpecConditions } },
      });
    }
    if ((whereClause.AND as any[]).length === 0) {
      delete whereClause.AND;
    }

    // === BƯỚC 5: TRUY VẤN CSDL (LẤY DỮ LIỆU VÀ ĐẾM TỔNG SỐ) ===
    const [products, totalProducts] = await prisma.$transaction([
      prisma.product.findMany({
        where: whereClause,
        orderBy: orderBy,
        skip: skip, //  Mới
        take: limit, //  Mới
        include: {
          brand: { select: { name: true, slug: true } },
          variants: {
            where: { isActive: true },
            orderBy: { price: "asc" },
            include: { Media: { select: { url: true, isPrimary: true } } },
          },
        },
      }),
      prisma.product.count({ where: whereClause }), //  Mới: Đếm tổng số
    ]);

    // === BƯỚC 6: XỬ LÝ KẾT QUẢ TRẢ VỀ ===
    let result = products
      .filter((product) => product.variants.length > 0)
      .map((product) => {
        const cheapestVariant = product.variants[0];
        let primaryImage = null;
        for (const variant of product.variants) {
          const foundImage = variant.Media.find((m) => m.isPrimary);
          if (foundImage) {
            primaryImage = foundImage.url;
            break;
          }
        }
        if (!primaryImage && cheapestVariant.Media.length > 0) {
          primaryImage = cheapestVariant.Media[0].url;
        }
        return {
          id: product.id,
          name: product.name,
          slug: product.slug,
          minPrice: cheapestVariant.price,
          image: primaryImage,
          ratingAvg: product.ratingAvg,
        };
      });

    // Sắp xếp theo giá (nếu có)
    if (priceSortDirection) {
      result.sort((a, b) => {
        const priceA = a.minPrice.toNumber();
        const priceB = b.minPrice.toNumber();
        return priceSortDirection === "asc" ? priceA - priceB : priceB - priceA;
      });
    }

    //  Mới: Tính toán metadata cho phân trang
    const totalPages = Math.ceil(totalProducts / limit);

    return {
      data: result,
      meta: {
        totalProducts,
        totalPages,
        currentPage: page,
        limit: limit,
      },
    };
  },
};
