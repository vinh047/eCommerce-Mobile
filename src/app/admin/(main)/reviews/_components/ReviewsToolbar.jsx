"use client";

import { ToolbarFilter } from "@/components/common/ToolbarFilter";

const starOptions = [
  { value: "5", label: "5 Sao" },
  { value: "4", label: "4 Sao" },
  { value: "3", label: "3 Sao" },
  { value: "2", label: "2 Sao" },
  { value: "1", label: "1 Sao" },
];

const statusOptions = [
  { value: "active", label: "Hiển thị" },
  { value: "inactive", label: "Đã ẩn" },
];

export default function ReviewsToolbar() {
  return (
    <ToolbarFilter
      searchPlaceholder="Tìm nội dung, tên khách hoặc sản phẩm..."
      searchKey="search"
      filters={[
        { key: "stars", label: "Số sao", options: starOptions },
        { key: "status", label: "Trạng thái", options: statusOptions },
      ]}
    />
  );
}