import { ToolbarFilter } from "@/components/common/ToolbarFilter";

const statusOptions = [
  { value: "active", label: "Hoạt động" },
  { value: "blocked", label: "Đã khóa" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

export default function StaffToolbar() {
  return (
    <ToolbarFilter
      searchPlaceholder="Tìm theo tên, email hoặc mã nhân viên..."
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