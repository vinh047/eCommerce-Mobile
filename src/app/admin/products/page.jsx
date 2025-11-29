import AdminLayout from "@/components/Layout/AdminLayout";
import ProductsClient from "./_components/ProductsClient";
import categoryApi from "@/lib/api/categoryApi";
import productApi from "@/lib/api/productApi";
import brandsApi from "@/lib/api/brandsApi";

export const metadata = { title: "Quản lý Sản phẩm | Admin" };

export default async function ProductsPage({ searchParams }) {
  const resolvedParams = JSON.parse(JSON.stringify(await searchParams));
  const paramsArray = Object.entries(resolvedParams)
    .filter(([key, value]) => value !== undefined && value !== null)
    .map(([key, value]) => [key, String(value)]);
  const queryString = new URLSearchParams(paramsArray).toString();

  const [productsRes, categoriesRes, brandsRes] = await Promise.all([
    productApi.getProducts(queryString),
    categoryApi.getCategories(),
    brandsApi.getBrands(),
  ]);

  return (
    <ProductsClient
      initialData={productsRes}
      categories={categoriesRes.data || []}
      brands={brandsRes.data || []}
    />
  );
}
