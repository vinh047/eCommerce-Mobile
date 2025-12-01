import { ToolbarFilter } from "@/components/common/ToolbarFilter";

const typeOptions = [
  { value: "in", label: "Nhập kho (Inbound)" },
  { value: "out", label: "Xuất kho (Outbound)" },
  { value: "adjustment", label: "Kiểm kê (Audit)" },
];

export default function InventoryToolbar() {
  return (
    <ToolbarFilter
      searchPlaceholder="Tìm theo Mã phiếu, SKU hoặc Serial..."
      searchKey="search"
      filters={[
        {
          key: "type",
          label: "Loại giao dịch",
          options: typeOptions,
        },
        // Có thể thêm filter theo ngày tháng nếu cần
      ]}
    />
  );
}