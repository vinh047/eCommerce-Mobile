"use client";

import { exportToCSV } from "@/utils/exportCSV";
import { toast } from "sonner";
import { useQueryParams } from "@/hooks/useQueryParams";
import categoryApi from "@/lib/api/categoryApi";

export function useExportCategoriesCSV() {
  const { getParam } = useQueryParams();

  const exportCategoriesCSV = async () => {
    const toastId = toast.loading("Đang chuẩn bị dữ liệu xuất...");
    try {
      // 1. Lấy Filter hiện tại từ URL
      const search = getParam("search") || "";
      const isActive = getParam("isActive") || "";
      const sortParam = getParam("sort") || "";
      const [sortBy, sortOrder] = sortParam.split(":");

      // 2. Gọi API lấy TOÀN BỘ dữ liệu (limit lớn)
      const res = await categoryApi.getCategories({
        search,
        isActive,
        sortBy: sortBy || "id",
        sortOrder: sortOrder || "desc",
        pageSize: 1000, // Lấy tối đa 1000 dòng
      });

      const categories = res.data;

      // 3. Định nghĩa Header cột
      const headers = [
        "ID",
        "Category Name",
        "Slug",
        "Parent Category",
        "Icon Key",
        "Active Status",
        "Product Count",
        "Sub-categories Count",
        "Created At",
      ];

      // 4. Map dữ liệu sang mảng 2 chiều
      const mapRow = (cat) => {
        return [
          [
            cat.id,
            cat.name,
            cat.slug,
            cat.parent ? cat.parent.name : "Root",
            cat.iconKey || "",
            cat.isActive ? "Active" : "Inactive",
            cat._count?.products || 0,
            cat._count?.children || 0,
            new Date(cat.createdAt).toISOString().split("T")[0],
          ],
        ];
      };

      // 5. Thực hiện xuất file
      await exportToCSV({
        data: categories,
        headers,
        mapRow,
        filename: `categories_export_${new Date().toISOString().slice(0, 10)}`,
      });

      toast.success("Xuất file thành công!", { id: toastId });
    } catch (err) {
      console.error("Export CSV failed:", err);
      toast.error("Không thể xuất dữ liệu.", { id: toastId });
    }
  };

  return { exportCategoriesCSV };
}
