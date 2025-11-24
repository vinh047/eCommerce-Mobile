"use client";

import { useQueryParams } from "@/hooks/useQueryParams";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

export default function ProductsTableHeader({
  selectedItems,
  currentPageData,
  onSelectAll,
}) {
  const { getParam, setParam } = useQueryParams();
  const sortParam = getParam("sort") || "";
  const [sortColumn, sortDirection] = sortParam.split(":");

  // Logic Checkbox "Select All"
  const pageIds = currentPageData.map((p) => p.id);
  const allSelected = pageIds.length > 0 && pageIds.every((id) => selectedItems.has(id));
  const someSelected = pageIds.some((id) => selectedItems.has(id));

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
    if (sortColumn !== column)
      return <ArrowUpDown className="w-3 h-3 ml-1 text-gray-400 opacity-50" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3 h-3 ml-1 text-blue-600" />
    ) : (
      <ArrowDown className="w-3 h-3 ml-1 text-blue-600" />
    );
  };

  return (
    <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase text-gray-500 dark:text-gray-300 font-semibold">
      <tr>
        <th className="px-6 py-3 w-10">
          <input
            type="checkbox"
            checked={allSelected}
            ref={(input) => {
              if (input) input.indeterminate = !allSelected && someSelected;
            }}
            onChange={onSelectAll}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 dark:bg-gray-700 border-gray-300 cursor-pointer"
          />
        </th>
        <th className="px-6 py-3 cursor-pointer select-none" onClick={() => handleSort("name")}>
          <div className="flex items-center">Sản phẩm {getSortIcon("name")}</div>
        </th>
        <th className="px-6 py-3 text-center">Kho & Giá</th>
        <th className="px-6 py-3">Danh mục</th>
        <th className="px-6 py-3 text-center cursor-pointer select-none" onClick={() => handleSort("isActive")}>
          <div className="flex items-center justify-center">
            Trạng thái {getSortIcon("isActive")}
          </div>
        </th>
        <th className="px-6 py-3 text-right">Thao tác</th>
      </tr>
    </thead>
  );
}