// app/admin/products/page.jsx
import AdminLayout from "@/components/Layout/AdminLayout";
import ProductsClient from "./_components/ProductsClient"; // Import file mới tạo
import categoryApi from "@/lib/api/categoryApi";
import productApi from "@/lib/api/productApi"; // Giả sử bạn có file này gọi API /api/products
import brandsApi from "@/lib/api/brandsApi";

export const metadata = { title: "Quản lý Sản phẩm | Admin" };

export default async function ProductsPage({ searchParams }) {
  // 1. Xử lý query string từ URL
  const resolvedParams = await searchParams;
  const paramsArray = Object.entries(resolvedParams)
    .filter(([_, value]) => value != null)
    .map(([key, value]) => [key, String(value)]);
  const queryString = new URLSearchParams(paramsArray).toString();

  // 2. Fetch Data song song
  const [productsRes, categoriesRes, brandsRes] = await Promise.all([
    // Gọi API lấy danh sách products (bạn tự viết hàm này hoặc fetch trực tiếp URL api)
    productApi.getProducts({ query: queryString }),
    categoryApi.getCategories(),
    brandsApi.getBrands(),
  ]);

  return (
    <AdminLayout>
      <ProductsClient 
        initialData={productsRes} 
        categories={categoriesRes.data || []} 
        brands={brandsRes.data || []}
      />
    </AdminLayout>
  );
}