import AdminLayout from "@/components/Layout/AdminLayout";

import categoryApi from "@/lib/api/categoryApi";
import { CategoriesClient } from "./_components";

export const metadata = {
  title: "Quản lý Danh mục | Admin",
};

export default async function CategoriesPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const paramsArray = Object.entries(resolvedParams)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => [key, String(value)]);

  const queryString = new URLSearchParams(paramsArray).toString();

  let initialData = { data: [], pagination: { totalItems: 0 } };

  try {
    initialData = await categoryApi.getCategories(queryString);
  } catch (error) {
    console.error("Failed to fetch initial categories data:", error);
  }

  return <CategoriesClient initialCategories={initialData} />;
}
