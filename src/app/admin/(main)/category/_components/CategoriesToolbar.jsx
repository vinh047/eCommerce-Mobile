import { ToolbarFilter } from "@/components/common/ToolbarFilter";

const statusOptions = [
  { value: "true", label: "Hoạt động" },
  { value: "false", label: "Đã ẩn" },
];

export default function CategoriesToolbar() {
  return (
    <ToolbarFilter
      searchPlaceholder="Tìm kiếm danh mục..."
      searchKey="search"
      filters={[
        {
          key: "isActive",
          label: "Trạng thái",
          options: statusOptions,
        },
      ]}
    />
  );
}