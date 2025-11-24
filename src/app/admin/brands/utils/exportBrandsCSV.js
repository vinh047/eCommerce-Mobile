"use client";

import { exportToCSV } from "@/utils/exportCSV";
import brandsApi from "@/lib/api/brandsApi";
import { toast } from "sonner";
import { useQueryParams } from "@/hooks/useQueryParams";

export function useExportBrandsCSV() {
  const { getParam } = useQueryParams();

  const exportBrandsCSV = async () => {
    try {
      const search = getParam("search") || "";
      const isActive = getParam("isActive") || "";

      const sortParam = getParam("sort") || "";
      const [sortBy, sortOrder] = sortParam.split(":");

      const res = await brandsApi.getBrands({
        search,
        isActive,
        sortBy: sortBy || "",
        sortOrder: sortOrder || "",

        limit: 1000,
      });

      const brands = res.data;

      const headers = [
        "ID",
        "Brand Name",
        "Slug",
        "Active Status",
        "Total Products",
        "Total Coupons",
        "Created At",
      ];

      const mapRow = (brand) => {
        return [
          [
            brand.id,
            brand.name,
            brand.slug,
            brand.isActive ? "Active" : "Inactive",
            brand._count?.products || 0,
            brand._count?.coupons || 0,
            new Date(brand.createdAt).toISOString(),
          ],
        ];
      };

      await exportToCSV({
        data: brands,
        headers,
        mapRow,
        filename: "brands_export",
      });

      toast.success("Đang tải xuống file danh sách thương hiệu...");
    } catch (err) {
      console.error("Export CSV failed:", err);
      toast.error("Không thể xuất CSV thương hiệu.");
    }
  };

  return { exportBrandsCSV };
}
