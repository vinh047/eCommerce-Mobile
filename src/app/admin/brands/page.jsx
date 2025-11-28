import AdminLayout from "@/components/Layout/AdminLayout";
import BrandsClient from "./_components/BrandsClient";
import brandsApi from "@/lib/api/brandsApi";

export default async function BrandsPage({ searchParams }) {
  const resolvedParams = JSON.parse(JSON.stringify(await searchParams));

  const paramsArray = Object.entries(resolvedParams)
    .filter(([key, value]) => value !== undefined && value !== null)
    .map(([key, value]) => [key, String(value)]);

  const queryString = new URLSearchParams(paramsArray).toString();

  let initialData = await brandsApi.getBrands(queryString);

  return <BrandsClient initialBrands={initialData} />;
}
