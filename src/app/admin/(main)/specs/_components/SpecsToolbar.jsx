"use client";

import { ToolbarFilter } from "@/components/common/ToolbarFilter";

export default function SpecsToolbar({ categories = [] }) {
  const categoryOptions = categories.map(c => ({ value: String(c.id), label: c.name }));

  return (
    <ToolbarFilter
      searchPlaceholder="Tìm kiếm mẫu thông số..."
      searchKey="search"
      filters={[
        {
          key: "categoryId",
          label: "Danh mục",
          options: categoryOptions,
        },
        {
          key: "isActive",
          label: "Trạng thái",
          options: [
            { value: "true", label: "Active" },
            { value: "false", label: "Inactive" },
          ],
        },
      ]}
    />
  );
}