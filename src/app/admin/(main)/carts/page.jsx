import AdminLayout from "@/components/Layout/AdminLayout";
import CartsClient from "./_components/CartsClient";
import cartsApi from "@/lib/api/cartsApi";

export const metadata = {
  title: "Quản lý Giỏ hàng | Admin Dashboard",
};

export default async function CartsPage({ searchParams }) {
  // Parse params để tránh lỗi object plain
  const resolvedParams = JSON.parse(JSON.stringify(await searchParams));

  const paramsArray = Object.entries(resolvedParams)
    .filter(([key, value]) => value !== undefined && value !== null)
    .map(([key, value]) => [key, String(value)]);

  const queryString = new URLSearchParams(paramsArray).toString();

  const initialData = await cartsApi.getCarts(queryString);

  return <CartsClient initialCarts={initialData} />;
}
