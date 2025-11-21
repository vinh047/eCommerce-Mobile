"use client";

import { useQueryParams } from "@/hooks/useQueryParams";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

export default function CategoriesTableHeader({
  columnVisibility,
  selectedItems,
  currentPageData,
  onSelectAll,
}) {
  const { getParam, setParam } = useQueryParams();

  const sortParam = getParam("sort") || "";
  const [sortColumn, sortDirection] = sortParam.split(":");

  const currentPageIds = currentPageData.map((c) => c.id);
  const allSelected =
    currentPageIds.length > 0 &&
    currentPageIds.every((id) => selectedItems.has(id));
  const someSelected = currentPageIds.some((id) => selectedItems.has(id));

  const handleSort = (column) => {
    if (sortColumn !== column) {
      setParam("sort", `${column}:desc`);
    } else if (sortDirection === "desc") {
      setParam("sort", `${column}:asc`);
    } else {
      setParam("sort", null);
    }
  };

  const getSortIcon = (column) => {
    if (sortColumn !== column) {
      return (
        <ArrowUpDown className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-50" />
      );
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ArrowDown className="w-4 h-4 text-blue-600" />
    );
  };

  const renderHeaderCell = (key, label, sortable = true) => (
    <th
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${
        sortable
          ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 group"
          : ""
      }`}
      onClick={sortable ? () => handleSort(key) : undefined}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        {sortable && getSortIcon(key)}
      </div>
    </th>
  );

  return (
    <thead className="bg-gray-50 dark:bg-gray-700">
      <tr>
        {/* Checkbox Select All */}
        <th className="px-6 py-3 text-left w-10">
          <input
            type="checkbox"
            checked={allSelected}
            ref={(input) => {
              if (input) input.indeterminate = !allSelected && someSelected;
            }}
            onChange={onSelectAll}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
          />
        </th>

        {/* Các cột dữ liệu */}
        {columnVisibility.id && renderHeaderCell("id", "ID")}
        {columnVisibility.name && renderHeaderCell("name", "Tên danh mục")}
        {columnVisibility.slug && renderHeaderCell("slug", "Slug")}

        {/* Các cột không sort được (do backend chưa hỗ trợ sort relation/count) */}
        {columnVisibility.parent &&
          renderHeaderCell("parent", "Danh mục cha", false)}
        {columnVisibility.icon && renderHeaderCell("icon", "Icon Key", false)}

        {columnVisibility.isActive &&
          renderHeaderCell("isActive", "Trạng thái")}
        {columnVisibility.productsCount &&
          renderHeaderCell("productsCount", "Sản phẩm", false)}

        {/* Cột CreatedAt nếu có trong visibility */}
        {columnVisibility.createdAt &&
          renderHeaderCell("createdAt", "Ngày tạo")}

        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
          Thao tác
        </th>
      </tr>
    </thead>
  );
}
