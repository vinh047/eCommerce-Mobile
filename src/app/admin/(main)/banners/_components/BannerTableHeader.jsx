"use client";

import { useQueryParams } from "@/hooks/useQueryParams";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

export default function BannerTableHeader({
  columnVisibility,
  selectedItems,
  currentPageItems,
  onSelectAll,
}) {
  const { getParam, setParam } = useQueryParams();
  const sortParam = getParam("sort") || "";
  const [sortColumn, sortDirection] = sortParam.split(":");

  const currentPageIds = currentPageItems.map((p) => p.id);
  const allSelected = currentPageIds.length > 0 && currentPageIds.every((id) => selectedItems.has(id));
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
    if (sortColumn !== column) return <ArrowUpDown className="w-3 h-3 text-gray-300 ml-1" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3 h-3 text-blue-600 ml-1" />
    ) : (
      <ArrowDown className="w-3 h-3 text-blue-600 ml-1" />
    );
  };

  const ThSortable = ({ field, label }) => (
    <th
      className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center">
        {label}
        {getSortIcon(field)}
      </div>
    </th>
  );

  return (
    <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
      <tr>
        <th className="px-6 py-3 text-left w-4">
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
        {columnVisibility.id && <ThSortable field="id" label="ID" />}
        {columnVisibility.image && (
             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Hình ảnh
            </th>
        )}
        {columnVisibility.altText && <ThSortable field="altText" label="Mô tả" />}
        {columnVisibility.product && (
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Sản phẩm
            </th>
        )}
        {columnVisibility.displayOrder && <ThSortable field="displayOrder" label="Thứ tự" />}
        {columnVisibility.isActive && <ThSortable field="isActive" label="Trạng thái" />}
        
        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
          Thao tác
        </th>
      </tr>
    </thead>
  );
}