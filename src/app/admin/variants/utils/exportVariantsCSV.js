"use client";

import { exportToCSV } from "@/utils/exportCSV";
import variantsApi from "@/lib/api/variantsApi";
import { toast } from "sonner";
import { useQueryParams } from "@/hooks/useQueryParams";

export function useExportVariantsCSV() {
  const { getParam } = useQueryParams();

  const exportVariantsCSV = async () => {
    try {
      const search = getParam("search") || "";
      const isActive = getParam("isActive") || "";
      const sortParam = getParam("sort") || "";
      const [sortBy, sortOrder] = sortParam.split(":");

      // Fetch toàn bộ (pageSize lớn hoặc logic backend hỗ trợ fetch all)
      const res = await variantsApi.getVariants({
        search,
        isActive,
        sortBy,
        sortOrder,
        pageSize: 9999, // Lấy số lượng lớn
      });

      const variants = res.data;
      const headers = [
        "ID",
        "Product Name",
        "Color",
        "Price",
        "Compare At Price",
        "Stock",
        "Status",
        "Created At",
      ];

      const mapRow = (v) => [
        [
          v.id,
          v.product?.name || "N/A",
          v.color,
          v.price,
          v.compareAtPrice || "",
          v.stock,
          v.isActive ? "Active" : "Inactive",
          new Date(v.createdAt).toISOString(),
        ],
      ];

      await exportToCSV({
        data: variants,
        headers,
        mapRow,
        filename: "variants_export",
      });
    } catch (err) {
      console.error("Export CSV failed:", err);
      toast.error("Không thể xuất CSV biến thể.");
    }
  };

  return { exportVariantsCSV };
}