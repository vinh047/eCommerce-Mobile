import { prisma } from "@/lib/prisma";
import { Prisma, ValueType } from "@prisma/client";

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
          take: 1, // Lấy biến thể rẻ nhất
          select: {
            id: true,
            price: true,
            compareAtPrice: true, // Lấy thêm cả giá gốc
            // SỬA LẠI Ở ĐÂY: Đi qua bảng MediaVariant để tới Media
            MediaVariant: {
              where: {
                Media: {
                  isPrimary: true, // Lọc những media là ảnh đại diện
                },
              },
              orderBy: {
                Media: {
                  sortOrder: "asc", // Ưu tiên ảnh có thứ tự sắp xếp nhỏ nhất
                },
              },
              take: 1, // Chỉ lấy 1 ảnh đại diện
              select: {
                Media: {
                  // Chọn các trường từ model Media
                  select: {
                    url: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return products.map((p) => {
      // Lấy ra variant rẻ nhất (nếu có)
      const cheapest = p.variants[0];

      const imageUrl = cheapest?.MediaVariant?.[0]?.Media?.url ?? null;

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        categoryId: p.categoryId,
        createdAt: p.createdAt,
        ratingAvg: p.ratingAvg,
        price: cheapest?.price ?? null,
        compareAtPrice: cheapest?.compareAtPrice ?? null,
        image: imageUrl,
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
    // === BƯỚC 1: LẤY THÔNG TIN SPEC  ===
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
    // Đảm bảo giá trị hợp lệ
    const effectivePage = Math.max(1, page);
    const effectiveLimit = Math.max(1, limit);

    const skip = (effectivePage - 1) * effectiveLimit;

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

    // === BƯỚC 5: TRUY VẤN CSDL  ===
    const [products, totalProducts] = await prisma.$transaction([
      prisma.product.findMany({
        where: whereClause,
        orderBy: orderBy,
        skip: skip,
        take: effectiveLimit,
        select: {
          // Chọn các trường của Product bạn cần
          id: true,
          name: true,
          slug: true,
          ratingAvg: true,
          brand: {
            select: { name: true, slug: true },
          },
          // Áp dụng logic giống hệt hàm đầu tiên cho variants
          variants: {
            where: { isActive: true },
            orderBy: { price: "asc" },
            take: 1, // Chỉ lấy variant rẻ nhất
            select: {
              price: true,
              compareAtPrice: true,
              MediaVariant: {
                orderBy: { Media: { sortOrder: "asc" } },
                take: 1, // Chỉ lấy 1 ảnh
                select: {
                  Media: {
                    select: { url: true, isPrimary: true },
                  },
                },
              },
            },
          },
        },
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    // === BƯỚC 6: XỬ LÝ KẾT QUẢ TRẢ VỀ ===
    let result = products
      .filter((product) => product.variants.length > 0)
      .map((product) => {
        const cheapestVariant = product.variants[0];
        let primaryImage = null;

        // Lấy ra danh sách media CHỈ của biến thể rẻ nhất
        const cheapestVariantMedia = cheapestVariant.MediaVariant.map(
          (mv) => mv.Media
        );

        // ƯU TIÊN 1: Tìm ảnh isPrimary trong biến thể rẻ nhất
        primaryImage = cheapestVariantMedia.find(
          (media) => media.isPrimary
        )?.url;

        // ƯU TIÊN 2: Nếu không có, lấy ảnh đầu tiên của biến thể rẻ nhất
        if (!primaryImage && cheapestVariantMedia.length > 0) {
          primaryImage = cheapestVariantMedia[0].url;
        }

        // PHƯƠNG ÁN CUỐI CÙNG: Nếu biến thể rẻ nhất không có ảnh nào,
        // thì mới tìm trong tất cả các biến thể khác để đảm bảo luôn có ảnh.
        if (!primaryImage) {
          const allMedia = product.variants.flatMap((variant) =>
            variant.MediaVariant.map((mv) => mv.Media)
          );
          // Tìm bất kỳ ảnh primary nào, hoặc ảnh đầu tiên bất kỳ
          primaryImage =
            allMedia.find((media) => media.isPrimary)?.url ||
            allMedia[0]?.url ||
            null;
        }

        return {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: cheapestVariant.price,
          compareAtPrice: cheapestVariant.compareAtPrice,
          image: primaryImage, // Ảnh giờ đã được lấy một cách nhất quán
          ratingAvg: product.ratingAvg,
        };
      });

    if (priceSortDirection) {
      result.sort((a, b) => {
        // Xử lý an toàn trường hợp giá có thể là null
        const priceA = a.price?.toNumber() || 0;
        const priceB = b.price?.toNumber() || 0;

        // Sắp xếp tăng dần hoặc giảm dần dựa trên cờ
        return priceSortDirection === "asc" ? priceA - priceB : priceB - priceA;
      });
    }

    // === BƯỚC 7: TRẢ VỀ KẾT QUẢ VÀ METADATA  ===
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
  async getProductBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        brand: true, // Thông tin thương hiệu
        category: true, // Thông tin danh mục
        productSpecValues: true, // Các thông số kỹ thuật của sản phẩm
        variants: {
          include: {
            // MediaVariant nối giữa Variant và Media
            MediaVariant: {
              include: {
                Media: true, // Lấy ảnh/video của biến thể
              },
            },
            variantSpecValues: true, // Lấy thông số riêng của biến thể (màu, dung lượng,…)
          },
        },
      },
    });
  },
};
