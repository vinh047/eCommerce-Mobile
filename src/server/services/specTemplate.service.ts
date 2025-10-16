import prisma from "@/lib/prisma";
import {
  SpecTemplate,
  ProductSpec,
  VariantSpec,
  ProductSpecOption,
  ProductBucket,
  VariantSpecOption,
  VariantBucket,
} from "@prisma/client";
import { brandService } from "./brand.service"; // Import Brand Service

// ====================================================================
// === TYPE DEFINITIONS ===
// ====================================================================

// 1. Định nghĩa kiểu cho Brand khi được dùng làm Filter Field
type BrandFilterField = {
  id: number;
  name: string;
  slug: string;
  type: "brand";
  options: { id: number; name: string; slug: string }[];
  // Các trường sau đảm bảo Brand Field tương thích với ProductSpec/VariantSpec
  code: "brand";
  label: "Thương hiệu";
  displayOrder: number;
};

// 2. Định nghĩa kiểu cho các Spec chung (Đã gộp Brand)
export type FilterSpec =
  | BrandFilterField
  | (ProductSpec & {
      options: ProductSpecOption[];
      buckets: ProductBucket[];
      type: "product";
    })
  | (VariantSpec & {
      options: VariantSpecOption[];
      buckets: VariantBucket[];
      type: "variant";
    });

// 3. Kiểu dữ liệu cuối cùng cho Response (Chỉ chứa trường fields đã gộp)
export type SpecTemplateWithMergedFilters = Omit<
  SpecTemplate,
  "productSpecs" | "variantSpecs"
> & {
  fields: FilterSpec[];
};

// ====================================================================
// === SERVICE LOGIC ===
// ====================================================================

export const specTemplateService = {
  /**
   * Lấy SpecTemplate, gộp ProductSpec, VariantSpec và Brand vào một mảng 'fields'.
   * @param categoryId ID của Category
   * @returns Promise<SpecTemplateWithMergedFilters | null>
   */
  async getFiltersByCategoryId(
    categoryId: number
  ): Promise<SpecTemplateWithMergedFilters | null> {
    // --- 1. Truy vấn SpecTemplate và Specs ---
    const templateWithFilters = await prisma.specTemplate.findFirst({
      where: { categoryId },
      include: {
        productSpecs: {
          orderBy: { displayOrder: "asc" },
          include: {
            // 🔥 THÊM SORT CHO OPTIONS VÀ BUCKETS
            options: { orderBy: { sortOrder: "asc" } },
            buckets: { orderBy: { sortOrder: "asc" } },
          },
        },
        variantSpecs: {
          orderBy: { displayOrder: "asc" },
          include: {
            // 🔥 THÊM SORT CHO OPTIONS VÀ BUCKETS
            options: { orderBy: { sortOrder: "asc" } },
            buckets: { orderBy: { sortOrder: "asc" } },
          },
        },
      },
    });

    if (!templateWithFilters) {
      return null;
    }

    // --- 2. Truy vấn Brands ---
    // Gọi Brand Service để lấy Brands liên quan
    const rawBrands = await brandService.getBrandsByCategoryId(categoryId);

    // --- 3. TẠO FILTER FIELD CHO BRAND VÀ ĐƯA LÊN ĐẦU ---
    const brandOptions = rawBrands.map((b) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
    }));

    const brandField: BrandFilterField = {
      id: 0, // ID cố định cho Brand Filter
      code: "brand",
      label: "Thương hiệu",
      type: "brand",
      displayOrder: -1, // Đảm bảo Brand luôn lên đầu
      options: brandOptions,
      // 🔥 ĐÃ KHẮC PHỤC LỖI: Thêm các trường 'name' và 'slug' bị thiếu
      name: "brand-filter-root",
      slug: "brand-filter-root",
    };

    // --- 4. GỘP VÀ XỬ LÝ DỮ LIỆU CỦA SPECS ---
    const { productSpecs, variantSpecs, ...templateData } = templateWithFilters;

    // Gắn thêm trường 'type' và gộp ProductSpec + VariantSpec
    const specFields: FilterSpec[] = [
      ...productSpecs.map((spec) => ({
        ...spec,
        type: "product" as const,
        buckets: spec.buckets || [],
      })),
      ...variantSpecs.map((spec) => ({
        ...spec,
        type: "variant" as const,
        buckets: spec.buckets || [],
      })),
    ];

    // --- 5. GỘP TẤT CẢ FIELDS VÀ SẮP XẾP ---
    const allFields: FilterSpec[] = [brandField, ...specFields];

    // Sắp xếp: BrandField có displayOrder: -1 sẽ lên đầu
    allFields.sort((a, b) => a.displayOrder - b.displayOrder);

    // --- 6. Trả về kết quả cuối cùng ---
    return {
      ...templateData,
      fields: allFields,
    } as SpecTemplateWithMergedFilters;
  },
};
