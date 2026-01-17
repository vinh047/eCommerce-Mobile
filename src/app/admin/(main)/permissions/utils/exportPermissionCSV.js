import { exportToCSV } from "@/utils/exportCSV";
import permissionsApi from "@/lib/api/permissionsApi"; // Giả định API service
import { toast } from "sonner";

export async function exportPermissionsCSV(filters, sortConfig) {
  try {
    // 1. Gọi API để lấy tất cả quyền hạn (không phân trang)
    const res = await permissionsApi.getPermissions({
      search: filters.search || "",
      sortBy: sortConfig.column,
      sortOrder: sortConfig.direction,
      // pageSize lớn để lấy hết dữ liệu, hoặc API có endpoint riêng cho export
      pageSize: 99999,
    });

    const permissions = res.data;

    // 2. Định nghĩa Header cho CSV
    const headers = ["ID", "Key", "Name", "Description", "Created At"];

    // 3. Hàm ánh xạ dữ liệu từ object permission sang mảng (hàng CSV)
    const mapRow = (permission) => [
      permission.id,
      permission.key,
      permission.name,
      permission.description,
      permission.createdAt ? new Date(permission.createdAt).toISOString() : "",
    ];

    // 4. Gọi hàm xuất CSV
    await exportToCSV({
      data: permissions,
      headers,
      mapRow: (permission) => [mapRow(permission)],
      filename: "permissions_export",
    });
  } catch (err) {
    console.error("Export CSV failed:", err);
    toast.error("Không thể xuất CSV quyền hạn.");
  }
}
