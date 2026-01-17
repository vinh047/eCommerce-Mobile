import AdminLayout from "@/components/Layout/AdminLayout";
import StaffClient from "./_components/StaffClient";
import staffApi from "@/lib/api/staffApi";

export default async function StaffPage({ searchParams }) {
  const resolvedParams = JSON.parse(JSON.stringify(await searchParams));

  // Clean params
  const paramsArray = Object.entries(resolvedParams)
    .filter(([key, value]) => value !== undefined && value !== null)
    .map(([key, value]) => [key, String(value)]);

  const queryString = new URLSearchParams(paramsArray).toString();

  // Server-side fetching
  let initialData = { data: [], pagination: { totalItems: 0 } };
  try {
    initialData = await staffApi.getStaffs(queryString);
  } catch (e) {
    console.error("Error loading staff data:", e);
  }

  return <StaffClient initialData={initialData} />;
}
