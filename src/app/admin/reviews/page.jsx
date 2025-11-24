import AdminLayout from "@/components/Layout/AdminLayout";
import reviewsApi from "@/lib/api/reviewsApi";
import ReviewsClient from "./_components/ReviewsClient";

export default async function ReviewsPage({ searchParams }) {
  const resolvedParams = JSON.parse(JSON.stringify(await searchParams));
  
  const paramsArray = Object.entries(resolvedParams)
    .filter(([key, value]) => value !== undefined && value !== null)
    .map(([key, value]) => [key, String(value)]);

  const queryString = new URLSearchParams(paramsArray).toString();
  
  let initialData = { data: [], pagination: { totalItems: 0 } };
  try {
     initialData = await reviewsApi.getReviews(queryString);
  } catch (e) {
     console.error("Error loading reviews data:", e);
  }

  return (
    <AdminLayout>
      <ReviewsClient initialData={initialData} />
    </AdminLayout>
  );
}