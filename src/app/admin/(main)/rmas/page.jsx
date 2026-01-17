import AdminLayout from "@/components/Layout/AdminLayout";
import rmasApi from "@/lib/api/rmasApi";
import RmasClient from "./_components/RmasClient";

export default async function RmasPage({ searchParams }) {
  const resolvedParams = JSON.parse(JSON.stringify(await searchParams));

  const paramsArray = Object.entries(resolvedParams)
    .filter(([key, value]) => value !== undefined && value !== null)
    .map(([key, value]) => [key, String(value)]);

  const queryString = new URLSearchParams(paramsArray).toString();

  let initialData = { data: [], pagination: { totalItems: 0 } };
  try {
    initialData = await rmasApi.getRmas(queryString);
  } catch (e) {
    console.error("Error loading RMA data:", e);
  }

  return <RmasClient initialData={initialData} />;
}
