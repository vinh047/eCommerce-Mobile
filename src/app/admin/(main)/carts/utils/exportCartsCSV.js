"use client";

import { exportToCSV } from "@/utils/exportCSV"; // Giả định file này đã có từ module User
import cartsApi from "@/lib/api/cartsApi";
import { toast } from "sonner";
import { useQueryParams } from "@/hooks/useQueryParams";

export function useExportCartsCSV() {
  const { getParam } = useQueryParams();

  const exportCartsCSV = async () => {
    try {
      const search = getParam("search") || "";
      const sortParam = getParam("sort") || "";
      const [sortBy, sortOrder] = sortParam.split(":");

      // Lấy toàn bộ data theo filter hiện tại (không phân trang hoặc trang rất lớn nếu API hỗ trợ)
      // Ở đây giả định API trả về data trang 1, trong thực tế cần API hỗ trợ export riêng hoặc limit=-1
      const res = await cartsApi.getCarts({
        search,
        sortBy: sortBy || "",
        sortOrder: sortOrder || "",
        pageSize: 1000, // Lấy số lượng lớn
      });

      const carts = res.data;
      const headers = [
        "Cart ID",
        "User ID",
        "User Name",
        "User Email",
        "Items Count",
        "Created At",
      ];

      const mapRow = (cart) => [
        [
          cart.id,
          cart.userId,
          cart.user?.name || "N/A",
          cart.user?.email || "N/A",
          cart.itemsCount || 0,
          new Date(cart.createdAt).toLocaleString("vi-VN"),
        ],
      ];

      await exportToCSV({
        data: carts,
        headers,
        mapRow,
        filename: `carts_export_${new Date().toISOString().split('T')[0]}`,
      });
      
      toast.success("Xuất CSV thành công!");
    } catch (err) {
      console.error("Export CSV failed:", err);
      toast.error("Không thể xuất CSV giỏ hàng.");
    }
  };

  return { exportCartsCSV };
}