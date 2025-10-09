import { prisma } from "@/lib/prisma";
import { specTemplateService } from "./specTemplate.service";
import { productSpecService } from "./productSpec.service";
import { variantSpecService } from "./variantSpec.service";
import { facetService } from "./facet.service";
import { brandService } from "./brand.service";
import { categoryService } from "./category.service";

type FEFields = Record<
  string,
  | {
      label: string;
      control: string;                // "select" | "multiselect" | "bucket-select" ...
      datatype: "string" | "boolean" | "number" | string;
      // chỉ có khi là select/multiselect có options
      options?: Array<{ value: string; label: string }>;
      // chỉ thêm khi là select cho phép nhiều lựa chọn (tuỳ logic dự án)
      multi?: boolean;
    }
  | {
      label: string;
      control: "bucket-select";
      datatype: "string";
      facet: { buckets: Array<{ id: string | number; label: string; count?: number }> };
    }
>;

const CONTROL_MAP: Record<string, string> = {
  bucket_select: "bucket-select",
  multiselect : "multiselect",
  select      : "select",
};

const DATATYPE_FALLBACK: "string" = "string";

const toKebab = (v: string) => v.toLowerCase().replace(/_/g, "-");

/** Suy ra datatype cho field từ OptionSpec (ưu tiên option đầu tiên) */
function inferDatatype(spec: any): "string" | "boolean" | "number" | string {
  const dt = spec?.options?.[0]?.datatype;
  if (!dt) return DATATYPE_FALLBACK;
  return typeof dt === "string" ? dt.toLowerCase() : String(dt);
}

/** Convert control DB -> FE */
function mapControl(control: string): string {
  const key = control?.toLowerCase();
  return CONTROL_MAP[key] ?? toKebab(control ?? "select");
}

/** Tạo options từ facet range */
function mapRangeFacetToOptions(facet: any): Array<{ value: string; label: string }> {
  const buckets = Array.isArray(facet?.buckets) ? facet.buckets : [];
  return buckets.map((b: any) => {
    const left = b?.gt != null ? String(b.gt) : "0";
    const right = b?.lte != null ? String(b.lte) : "";
    return { value: `${left}-${right}`, label: b.label };
  });
}

/** Map 1 spec (ProductSpec/VariantSpec) -> 1 field FE */
function mapSpecToField(spec: any): FEFields[string] | null {
  if (!spec) return null;

  const control = mapControl(spec.control);
  const datatype = inferDatatype(spec);

  // Nếu facet là range -> FE dùng options (value = "gt-lte")
  if (spec?.facet?.type === "range") {
    const options = mapRangeFacetToOptions(spec.facet);
    return {
      label: spec.label,
      control: "select",              // FE mẫu đang dùng "select" cho range
      datatype: "string",             // FE mẫu mong "string" cho value "gt-lte"
      multi: control === "multiselect" || spec.name === "price_range" || spec.name === "condition" || false,
      options,
    };
  }

  // Ngược lại: dùng options từ OptionSpec
  const options = (spec.options ?? []).map((o: any) => ({
    value: String(o.value),
    label: o.label,
  }));

  if (control === "bucket-select") {
    // bucket-select (discrete) theo FE chỉ có ở brand trong ví dụ.
    // Tuy nhiên nếu DB có spec control = bucket_select, vẫn trả theo facet.buckets nếu có.
    const facetBuckets =
      Array.isArray(spec?.facet?.buckets) && spec.facet.buckets.length
        ? spec.facet.buckets.map((b: any) => ({ id: b.id, label: b.label }))
        : options.map((o, idx) => ({ id: idx + 1, label: o.label })); // không có count ở DB

    return {
      label: spec.label,
      control: "bucket-select",
      datatype,
      facet: { buckets: facetBuckets },
    };
  }

  const field: any = {
    label: spec.label,
    control,
    datatype,
    options,
  };

  // FE mẫu chỉ set multi cho một vài field; nếu control là multiselect thì có thể không cần multi.
  // Nếu đội FE muốn set rõ, bật dòng dưới:
  // if (control === "select" && spec.allowMulti) field.multi = true;

  return field as FEFields[string];
}

/** Merge các spec vào fields (ưu tiên theo tên spec) */
function buildFieldsFromSpecs(productSpecs: any[], variantSpecs: any[]): FEFields {
  const fields: FEFields = {};

  const upsertField = (name: string, spec: any) => {
    const f = mapSpecToField(spec);
    if (f) fields[name] = f;
  };

  // Map toàn bộ productSpecs
  for (const ps of productSpecs ?? []) {
    upsertField(ps.name, ps);
  }
  // Map toàn bộ variantSpecs (ghi đè nếu trùng key, tuỳ yêu cầu)
  for (const vs of variantSpecs ?? []) {
    upsertField(vs.name, vs);
  }

  return fields;
}

/** Thêm field brand từ brands (chỉ brand lấy từ brands theo yêu cầu) */
function injectBrandField(fields: FEFields, brands: Array<{ id?: string | number; slug?: string; code?: string; name: string; count?: number }>) {
  const buckets = (brands ?? []).map((b, i) => ({
    id: b.slug ?? b.code ?? b.id ?? i + 1,
    label: b.name,
    count: typeof b.count === "number" ? b.count : 0,
  }));

  fields.brand = {
    label: "Thương hiệu",
    control: "bucket-select",
    datatype: "string",
    facet: { buckets },
  };
}


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

  async getFiltersByCategory(categoryId: number) {
    const specTemplate = await specTemplateService.getByCategoryId(categoryId);
    const brands = await brandService.getBrandsByCategory(categoryId); // [{name,slug,count?}, ...]

    const category = await categoryService.getById(categoryId);

    if (!specTemplate)
      throw new Error("Spec template not found for this category");

    const [productSpecs, variantSpecs] = await Promise.all([
      productSpecService.getSpecsWithFacetsByTemplateId(specTemplate.id),
      variantSpecService.getSpecsWithFacetsByTemplateId(specTemplate.id),
    ]);

    if (!productSpecs?.length) {
      throw new Error(
        `Không tìm thấy ProductSpec cho template #${specTemplate.id}`
      );
    }
    if (!variantSpecs?.length) {
      throw new Error(
        `Không tìm thấy VariantSpec cho template #${specTemplate.id}`
      );
    }

    const fields = buildFieldsFromSpecs(productSpecs, variantSpecs);

  // chỉ brand lấy từ brands (ghi đè nếu có spec brand trong DB)
  injectBrandField(fields, brands);

  return {
    data: {
      meta: {
        category: { id: category?.id, slug: category?.slug, name: category?.name },
        updated_at: new Date().toISOString(),
        version: specTemplate.version ?? 1,
      },
      fields,
    },
  };

  },
};
