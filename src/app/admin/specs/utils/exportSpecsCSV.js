"use client";

import { exportToCSV } from "@/utils/exportCSV";
import specsApi from "@/lib/api/specsApi";
import { toast } from "sonner";
import { useQueryParams } from "@/hooks/useQueryParams";

export function useExportSpecsCSV() {
  const { getParam } = useQueryParams();

  const exportSpecsCSV = async () => {
    const toastId = toast.loading("Đang chuẩn bị dữ liệu xuất...");
    try {
      const search = getParam("search") || "";
      const categoryId = getParam("categoryId") || "";
      const isActive = getParam("isActive") || "";
      const sortParam = getParam("sort") || "";
      const [sortBy, sortOrder] = sortParam.split(":");

      const res = await specsApi.getSpecs({
        search,
        categoryId,
        isActive,
        sortBy: sortBy || "id",
        sortOrder: sortOrder || "desc",
        pageSize: 1000,
      });

      const specs = res.data;

      const headers = [
        "ID",
        "Template Name",
        "Category",
        "Version",
        "Active Status",
        "Fields Count",
        "Created At",
      ];

      const mapRow = (item) => {
        return [
          [
            item.id,
            item.name,
            item.category?.name || "N/A",
            `v${item.version}`,
            item.isActive ? "Active" : "Inactive",
            item._count?.productSpecs || 0,
            new Date(item.createdAt).toISOString().split("T")[0],
          ],
        ];
      };

      await exportToCSV({
        data: specs,
        headers,
        mapRow,
        filename: `specs_template_export_${new Date()
          .toISOString()
          .slice(0, 10)}`,
      });

      toast.success("Xuất file thành công!", { id: toastId });
    } catch (err) {
      console.error("Export CSV failed:", err);
      toast.error("Không thể xuất dữ liệu.", { id: toastId });
    }
  };

  return { exportSpecsCSV };
}
