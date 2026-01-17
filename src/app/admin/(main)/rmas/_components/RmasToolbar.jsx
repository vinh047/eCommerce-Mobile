"use client";

import { ToolbarFilter } from "@/components/common/ToolbarFilter";

const typeOptions = [
  { value: "return", label: "Trả hàng/Hoàn tiền" },
  { value: "exchange", label: "Đổi hàng" },
  { value: "repair", label: "Bảo hành/Sửa chữa" },
];

const statusOptions = [
  { value: "pending", label: "Chờ xử lý" },
  { value: "approved", label: "Đã duyệt" },
  { value: "rejected", label: "Từ chối" },
  { value: "completed", label: "Hoàn tất" },
];

export default function RmasToolbar() {
  return (
    <ToolbarFilter
      searchPlaceholder="Tìm mã đơn hàng (VD: #ORD123)..."
      searchKey="search"
      filters={[
        { key: "type", label: "Loại yêu cầu", options: typeOptions },
        { key: "status", label: "Trạng thái", options: statusOptions },
      ]}
    />
  );
}