import variantsApi from "@/lib/api/variantsApi";
import InventoryClient from "./_components/InventoryClient";
import inventoryApi from "@/lib/api/inventoryApi";

export default async function InventoryPage({ searchParams }) {
  // Parse search params từ URL để giữ trạng thái filter khi refresh
  const resolvedParams = await searchParams; // Next.js 15 requires awaiting searchParams
  const paramsArray = Object.entries(resolvedParams || {})
    .filter(([key, value]) => value !== undefined && value !== null)
    .map(([key, value]) => [key, String(value)]);

  const queryString = new URLSearchParams(paramsArray).toString();
  
  // Fetch dữ liệu khởi tạo
  const [transactionsRes, variantsRes] = await Promise.all([
    inventoryApi.getTransactions(queryString).catch((e) => {
      console.error("Fetch specs error:", e);
      return { data: [], pagination: { totalItems: 0 } };
    }),
        variantsApi
      .getVariants({ pageSize: 1000, isActive: true })
      .catch((e) => {
        console.error("Fetch categories error:", e);
        return { data: [] };
      }),
  ]);
  return <InventoryClient initialTransactions={transactionsRes} initialVariants={variantsRes}  />;
}