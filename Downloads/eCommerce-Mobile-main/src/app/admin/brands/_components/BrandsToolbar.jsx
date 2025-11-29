import { ToolbarFilter } from "@/components/common/ToolbarFilter";

const statusOptions = [
  { value: "true", label: "Hoạt động" },
  { value: "false", label: "Đã ẩn" },
];

export default function BrandsToolbar() {
  return (
    <ToolbarFilter
      searchPlaceholder="Tìm theo tên thương hiệu..."
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