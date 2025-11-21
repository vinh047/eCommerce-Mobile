import AdminLayout from "@/components/Layout/AdminLayout";

import specsApi from "@/lib/api/specsApi";
import { SpecsClient } from "./_components";
import categoryApi from "@/lib/api/categoryApi";

export const metadata = {
  title: "Quản lý Mẫu thông số | Admin",
};

export default async function SpecsPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const paramsArray = Object.entries(resolvedParams)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => [key, String(value)]);

  const queryString = new URLSearchParams(paramsArray).toString();

  const [specsRes, categoriesRes] = await Promise.all([
    specsApi.getSpecs(queryString).catch((e) => {
      console.error("Fetch specs error:", e);
      return { data: [], pagination: { totalItems: 0 } };
    }),
    categoryApi
      .getCategories({ pageSize: 100, isActive: true })
      .catch((e) => {
        console.error("Fetch categories error:", e);
        return { data: [] };
      }),
  ]);
  console.log("SpecsPage specsRes:", specsRes);
  console.log("SpecsPage categoriesRes:", categoriesRes);

  return (
    <AdminLayout>
      <SpecsClient
        initialData={specsRes}
        categories={categoriesRes.data  || []}
      />
    </AdminLayout>
  );
}
