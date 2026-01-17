import AdminLayout from "@/components/Layout/AdminLayout";
import ordersApi from "@/lib/api/ordersApi";
import OrdersClient from "./_components/OrdersClient";

export default async function OrdersPage({ searchParams }) {
  const resolvedParams = JSON.parse(JSON.stringify(await searchParams));

  const paramsArray = Object.entries(resolvedParams)
    .filter(([key, value]) => value !== undefined && value !== null)
    .map(([key, value]) => [key, String(value)]);

  const queryString = new URLSearchParams(paramsArray).toString();

  let initialData = { data: [], pagination: { totalItems: 0 } };
  try {
    initialData = await ordersApi.getOrders(queryString);
  } catch (e) {
    console.error("Error loading orders data:", e);
  }

  return <OrdersClient initialData={initialData} />;
}
