import productsApi from "@/lib/api/productApi";
import categoryApi from "@/lib/api/categoryApi";
import brandsApi from "@/lib/api/brandsApi";
import ProductEditor from "../_components/ProductEditor"; // Import component "nhạc trưởng" nãy mình viết

export const metadata = {
  title: "Thêm sản phẩm mới | Admin",
};

export default async function CreateProductPage({brandApi = null}) {
  // 1. Fetch dữ liệu cần thiết cho Form (Danh mục, Brand)
  // Dùng Promise.all để fetch song song cho nhanh
  const [categoriesRes, brandsRes] = await Promise.all([
    categoryApi
      .getCategories({ isActive: true, pageSize: 100 })
      .catch(() => ({ data: [] })),

    // Nếu chưa có brandApi thì fallback về mảng rỗng
    brandApi
      ? brandApi
          .getBrands({ isActive: true, pageSize: 100 })
          .catch(() => ({ data: [] }))
      : Promise.resolve({ data: [] }),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Truyền data xuống ProductEditor */}
      <ProductEditor
        categories={categoriesRes.data || []}
        brands={brandsRes?.data || []}
        mode="create"
      />
    </div>
  );
}
