import productsApi from "@/lib/api/productApi";
import VariantsClient from "./_components/VariantsClient"; // File bạn đã tạo ở bước trước
import variantsApi from "@/lib/api/variantsApi";

export default async function VariantsPage({ searchParams }) {
  const resolvedParams = JSON.parse(JSON.stringify(await searchParams));

  // Chuyển params object thành query string
  const paramsArray = Object.entries(resolvedParams)
    .filter(([key, value]) => value !== undefined && value !== null)
    .map(([key, value]) => [key, String(value)]);

  const queryString = new URLSearchParams(paramsArray).toString();

  // Fetch dữ liệu server-side lần đầu (SEO + Performance)
  const [variantsRes, productsRes] = await Promise.all([
    variantsApi.getVariants(queryString),
    productsApi.getAll(),
  ]);


  return (
    <VariantsClient
      initialVariants={variantsRes}
      initialProducts={productsRes.data}
    />
  );
}
