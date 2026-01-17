import { notFound } from "next/navigation";
import ProductEditor from "../../_components/ProductEditor";
import productsApi from "@/lib/api/productApi";
import categoryApi from "@/lib/api/categoryApi";
import brandsApi from "@/lib/api/brandsApi";

export const metadata = {
  title: "Chỉnh sửa sản phẩm | Admin",
};

export default async function EditProductPage({ params }) {
  const { id } = await params;

  // 1. Fetch dữ liệu Product + Categories + Brands cùng lúc
  const [productRes, categoriesRes, brandsRes] = await Promise.all([
    productsApi.getProductById(id).catch(() => null),
    categoryApi.getCategories({ isActive: true, pageSize: 100 }).catch(() => ({ data: [] })),
     brandsApi.getBrands({ isActive: true, pageSize: 100 }).catch(() => ({ data: [] }))
  ]);

  // Nếu không tìm thấy sản phẩm -> trang 404
  if (!productRes || !productRes.data) {
    notFound();
  }

  const productData = productRes.data;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <ProductEditor
        mode="edit"
        initialData={productData} // Truyền dữ liệu cũ vào để fill form
        categories={categoriesRes.data || []}
        brands={brandsRes?.data || []}
      />
    </div>
  );
}