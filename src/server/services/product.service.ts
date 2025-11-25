import compareTwoStrings from "string-similarity-js";
import { prisma } from "@/lib/prisma";
import { Prisma, ValueType } from "@prisma/client";
import { variant } from "@/prisma/seedData2";
import { includes } from "zod";

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

    // Xử lý page và limit
    const page = parseInt(filters.page || "1", 10);
    const limit = parseInt(filters.limit || "10", 10);
    const effectivePage = Math.max(1, page);
    const effectiveLimit = Math.max(1, limit);
    const skip = (effectivePage - 1) * effectiveLimit;

    const productSpecConditions: Prisma.ProductWhereInput[] = [];
    const variantSpecConditions: Prisma.VariantWhereInput[] = [];

    // --- XỬ LÝ Q (từ khóa tìm kiếm trên tên sản phẩm) ---
    const qRaw = String(filters.q || filters.search || "").trim();
    if (qRaw) {
      const q = qRaw.toLowerCase().trim();
      const tokens = q.split(/\s+/).filter(Boolean);

      const perTokenConditions: Prisma.ProductWhereInput[] = tokens.map((t) => {
        return {
          OR: [
            // product fields
            { name: { contains: t, mode: "insensitive" as Prisma.QueryMode } },
            { slug: { contains: t, mode: "insensitive" as Prisma.QueryMode } },
            // brand name
            {
              brand: {
                name: { contains: t, mode: "insensitive" as Prisma.QueryMode },
              },
            },
            // variant fields: color
            {
              variants: {
                some: {
                  color: {
                    contains: t,
                    mode: "insensitive" as Prisma.QueryMode,
                  },
                },
              },
            },
            // variantSpecValues.stringValue (nơi lưu text của variant specs)
            {
              variants: {
                some: {
                  variantSpecValues: {
                    some: {
                      stringValue: {
                        contains: t,
                        mode: "insensitive" as Prisma.QueryMode,
                      },
                    },
                  },
                },
              },
            },
          ],
        } as Prisma.ProductWhereInput;
      });

      if (perTokenConditions.length > 0) {
        (whereClause.AND as Prisma.ProductWhereInput[]).push(
          ...perTokenConditions
        );
      }
    }

    // Xử lý các filter khác (brand, sort, specs)
    for (const key in filters) {
      const value = filters[key];
      if (!value) continue;

      // Bỏ qua page, limit, q/search trong vòng lặp chính
      if (
        key === "page" ||
        key === "limit" ||
        key === "q" ||
        key === "search"
      ) {
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
          id: true,
          name: true,
          slug: true,
          ratingAvg: true,
          brand: {
            select: { name: true, slug: true },
          },
          variants: {
            where: { isActive: true },
            orderBy: { price: "asc" },
            take: 1,
            select: {
              price: true,
              compareAtPrice: true,
              MediaVariant: {
                orderBy: { Media: { sortOrder: "asc" } },
                take: 1,
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

        const cheapestVariantMedia = cheapestVariant.MediaVariant.map(
          (mv) => mv.Media
        );

        primaryImage = cheapestVariantMedia.find(
          (media) => media.isPrimary
        )?.url;

        if (!primaryImage && cheapestVariantMedia.length > 0) {
          primaryImage = cheapestVariantMedia[0].url;
        }

        if (!primaryImage) {
          const allMedia = product.variants.flatMap((variant) =>
            variant.MediaVariant.map((mv) => mv.Media)
          );
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
          image: primaryImage,
          ratingAvg: product.ratingAvg,
        };
      });

    if (priceSortDirection) {
      result.sort((a, b) => {
        const priceA =
          a.price && typeof (a.price as any).toNumber === "function"
            ? (a.price as any).toNumber()
            : Number(a.price ?? 0);
        const priceB =
          b.price && typeof (b.price as any).toNumber === "function"
            ? (b.price as any).toNumber()
            : Number(b.price ?? 0);
        return priceSortDirection === "asc" ? priceA - priceB : priceB - priceA;
      });
    }

    // === BƯỚC 7: TRẢ VỀ KẾT QUẢ VÀ METADATA  ===
    const totalItems = Number(totalProducts || 0);
    const totalPages = Math.ceil(totalItems / effectiveLimit) || 1;

    return {
      data: result,
      meta: {
        totalItems, // tổng số item (sử dụng key totalItems)
        totalPages,
        currentPage: effectivePage,
        limit: effectiveLimit,
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
        Review: {
          where: { isActived: true },
          take: 5,
          include: {
            user: true,
          },
        }, // Lấy đánh giá của sản phẩm
      },
    });
  },
  async getReviewsByProductId(
    productId: number,
    offset: number,
    limit: number
  ) {
    const newReview = await prisma.review.findMany({
      where: { productId, isActived: true },
      skip: offset,
      take: limit,
      include: {
        user: true,
      },
    });
    console.log(newReview);
    return newReview;
  },
  async findSimilarProductsById(
    productId: number,
    threshold = 0.6,
    limit = 10
  ) {
    // Lấy sản phẩm gốc
    const original = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!original) {
      throw new Error("Sản phẩm không tồn tại");
    }

    // Lấy tất cả sản phẩm khác trong bảng
    const allProducts = await prisma.product.findMany({
      where: {
        id: { not: productId },
      },
      include: {
        variants: {
          include: {
            MediaVariant: {
              include: {
                Media: true,
              },
            },
          },
        },
      },
    });

    // So sánh tên và lọc
    const similarProducts = allProducts
      .map((p) => ({
        ...p,
        similarity: compareTwoStrings(p.name, original.name),
      }))
      .filter((p) => p.similarity > threshold)
      .sort((a, b) => b.similarity - a.similarity) // ưu tiên giống nhất
      .slice(0, limit); // tối đa `limit` sản phẩm

    return similarProducts;
  },
};
