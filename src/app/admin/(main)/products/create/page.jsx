import ProductEditor from "../_components/ProductEditor";
import categoryApi from "@/lib/api/categoryApi";
import brandsApi from "@/lib/api/brandsApi";
export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Thêm sản phẩm mới | Admin",
};

export default async function CreateProductPage() {
  // 1. Fetch dữ liệu Categories + Brands để đổ vào Select option
  // Ở trang Create, ta không cần fetch productById
  const [categoriesRes, brandsRes] = await Promise.all([
    categoryApi
      .getCategories({ isActive: true, pageSize: 100 })
      .catch(() => ({ data: [] })),
    brandsApi
      .getBrands({ isActive: true, pageSize: 100 })
      .catch(() => ({ data: [] })),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <ProductEditor
        mode="create"
        // Không cần truyền initialData
        categories={categoriesRes.data || []}
        brands={brandsRes?.data || []}
      />
    </div>
  );
}
