import { ToolbarFilter } from "@/components/common/ToolbarFilter";

const statusOptions = [
  { value: "active", label: "Hoạt động" },
  { value: "blocked", label: "Đã khóa" },
];

export default function UsersToolbar() {
  return (
    <ToolbarFilter
      searchPlaceholder="Tìm theo tên hoặc Email người dùng..."
      searchKey="search"
      filters={[
        {
          key: "statusQuery",
          label: "Trạng thái",
          options: statusOptions,
        },
      ]}
    />
  );
}
