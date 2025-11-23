"use client";

import { ToolbarFilter } from "@/components/common/ToolbarFilter";

export default function ProductsToolbar({ categories = [], brands = [] }) {
  // Map data sang format { value, label } cho select
  const categoryOptions = categories.map((c) => ({
    value: String(c.id),
    label: c.name,
  }));
  const brandOptions = brands.map((b) => ({
    value: String(b.id),
    label: b.name,
  }));

  return (
    <ToolbarFilter
      searchPlaceholder="Tìm tên sản phẩm, SKU..."
      searchKey="search"
      filters={[
        {
          key: "categoryId",
          label: "Danh mục",
          options: categoryOptions,
        },
        {
          key: "brandId",
          label: "Thương hiệu",
          options: brandOptions,
        },
        {
          key: "isActive",
          label: "Trạng thái",
          options: [
            { value: "true", label: "Đang kinh doanh" },
            { value: "false", label: "Ngừng kinh doanh" },
          ],
        },
      ]}
    />
  );
}
