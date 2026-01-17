import bannersApi from "@/lib/api/bannerApi";
import BannerClient from "./_components/BannerClient";

export default async function BannerPage({ searchParams }) {
  const resolvedParams = await searchParams;

  const paramsArray = Object.entries(resolvedParams)
    .filter(([key, value]) => value !== undefined && value !== null)
    .map(([key, value]) => [key, String(value)]);

  const queryString = new URLSearchParams(paramsArray).toString();

  let initialData = { data: [], pagination: { totalItems: 0 } };
  try {
    initialData = await bannersApi.getBanners(queryString);
    console.log(initialData)
  } catch (e) {
    console.error("Error loading banner data:", e);
  }

  return <BannerClient initialData={initialData} />;
}
