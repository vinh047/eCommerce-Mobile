"use client";

import { ToolbarFilter } from "@/components/common/ToolbarFilter";

const statusOptions = [
  { value: "true", label: "Đang bán" },
  { value: "false", label: "Đang ẩn" },
];

const stockOptions = [
  { value: "in_stock", label: "Còn hàng" },
  { value: "low_stock", label: "Sắp hết" },
  { value: "out_of_stock", label: "Hết hàng" },
];

export default function VariantsToolbar() {
  return (
    <ToolbarFilter
      searchPlaceholder="Tìm theo tên sản phẩm, mã SKU hoặc màu sắc..."
      searchKey="search"
      filters={[
        {
          key: "isActive",
          label: "Trạng thái",
          options: statusOptions,
        },
        {
          key: "stockStatus",
          label: "Tồn kho",
          options: stockOptions,
        },
      ]}
    />
  );
}