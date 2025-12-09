import { ToolbarFilter } from "@/components/common/ToolbarFilter";

const statusOptions = [
  { value: "true", label: "Đang hiển thị" },
  { value: "false", label: "Đang ẩn" },
];

export default function BannerToolbar() {
  return (
    <ToolbarFilter
      searchPlaceholder="Tìm theo Alt Text hoặc tên sản phẩm..."
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