"use client";

import { useQueryParams } from "@/hooks/useQueryParams";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

export default function RmasTableHeader({
  columnVisibility,
  selectedItems,
  currentPageItems,
  onSelectAll,
}) {
  const { getParam, setParam } = useQueryParams();
  const sortParam = getParam("sort") || "";
  const [sortColumn, sortDirection] = sortParam.split(":");

  const currentIds = currentPageItems.map((r) => r.id);
  const allSelected = currentIds.every((id) => selectedItems.has(id));
  const someSelected = currentIds.some((id) => selectedItems.has(id));

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
      <div className="flex items-center gap-1">
        {label}
        {getSortIcon(field)}
      </div>
    </th>
  );

  return (
    <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
      <tr>
        <th className="px-6 py-3 w-4">
          <input
            type="checkbox"
            checked={allSelected}
            ref={(input) => { if (input) input.indeterminate = !allSelected && someSelected; }}
            onChange={onSelectAll}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
          />
        </th>
        {columnVisibility.id && <ThSortable field="id" label="ID" />}
        {columnVisibility.order && <ThSortable field="orderId" label="Mã đơn" />}
        {columnVisibility.item && <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Sản phẩm</th>}
        {columnVisibility.type && <ThSortable field="type" label="Loại" />}
        {columnVisibility.reason && <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Lý do</th>}
        {columnVisibility.status && <ThSortable field="status" label="Trạng thái" />}
        {columnVisibility.createdAt && <ThSortable field="createdAt" label="Ngày gửi" />}
        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Thao tác</th>
      </tr>
    </thead>
  );
}