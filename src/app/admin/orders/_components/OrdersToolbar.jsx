"use client";

import { ToolbarFilter } from "@/components/common/ToolbarFilter";

const orderStatusOptions = [
  { value: "pending", label: "Chờ xử lý" },
  { value: "processing", label: "Đang xử lý" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
];

const paymentStatusOptions = [
  { value: "pending", label: "Chưa thanh toán" },
  { value: "paid", label: "Đã thanh toán" },
  { value: "failed", label: "Thất bại" },
];

export default function OrdersToolbar() {
  return (
    <ToolbarFilter
      searchPlaceholder="Tìm mã đơn (VD: #ORD001) hoặc tên khách..."
      searchKey="search"
      filters={[
        {
          key: "status",
          label: "Trạng thái đơn",
          options: orderStatusOptions,
        },
        {
          key: "paymentStatus",
          label: "Thanh toán",
          options: paymentStatusOptions,
        },
      ]}
    />
  );
}