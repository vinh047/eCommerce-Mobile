import { exportToCSV } from "@/utils/exportCSV";
import usersApi from "@/lib/api/usersApi";
import { toast } from "sonner";

export async function exportUsersCSV(filters, sortConfig) {
  try {
    const res = await usersApi.getUsers({
      search: filters.search || "",
      status: filters.status || "",
      sortBy: sortConfig.column,
      sortOrder: sortConfig.direction,
    });

    const users = res.data;
    const headers = [
      "ID",
      "Email",
      "Name",
      "Status",
      "Created At",
      "Phone",
      "Address Line",
      "Ward",
      "District",
      "Province",
    ];

    const mapRow = (user) => {
      if (!user.addresses || user.addresses.length === 0) {
        return [
          [
            user.id,
            user.email,
            user.name,
            user.status,
            new Date(user.createdAt).toISOString(),
            "",
            "",
            "",
            "",
            "",
          ],
        ];
      }

      return user.addresses.map((addr, i) => [
        i === 0 ? user.id : "",
        i === 0 ? user.email : "",
        i === 0 ? user.name : "",
        i === 0 ? user.status : "",
        i === 0 ? new Date(user.createdAt).toISOString() : "",
        addr.phone || "",
        addr.line || "",
        addr.ward || "",
        addr.district || "",
        addr.province || "",
      ]);
    };

    await exportToCSV({
      data: users,
      headers,
      mapRow,
      filename: "users_export",
    });
  } catch (err) {
    console.error("Export CSV failed:", err);
    toast.error("Không thể xuất CSV người dùng.");
  }
}
