"use client";

import { useQueryParams } from "@/hooks/useQueryParams"; // Đảm bảo bạn có hook này
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import PermissionGate from "../../../_components/PermissionGate";
import { PERMISSION_KEYS } from "../../constants/permissions";

export default function SpecsTableHeader({
  selectedItems,
  currentPageData,
  onSelectAll,
}) {
  const { getParam, setParam } = useQueryParams();
  const sortParam = getParam("sort") || "";
  const [sortColumn, sortDirection] = sortParam.split(":");

  // Logic Checkbox "Select All"
  const pageIds = currentPageData.map((s) => s.id);
  const allSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedItems.has(id));
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
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
          />
        </th>
        <th
          className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors select-none"
          onClick={() => handleSort("id")}
        >
          <div className="flex items-center">ID {getSortIcon("id")}</div>
        </th>
        <th
          className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors select-none"
          onClick={() => handleSort("name")}
        >
          <div className="flex items-center">Tên Mẫu {getSortIcon("name")}</div>
        </th>
        <th className="px-6 py-3">Danh mục</th>
        <th className="px-6 py-3 text-center">Phiên bản</th>
        <th
          className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors select-none"
          onClick={() => handleSort("isActive")}
        >
          <div className="flex items-center justify-center">
            Trạng thái {getSortIcon("isActive")}
          </div>
        </th>
        <PermissionGate permission={PERMISSION_KEYS.UPDATE_SPEC}>
          <th className="px-6 py-3 text-center">Cấu hình</th>
        </PermissionGate>
        <PermissionGate
          permission={
            (PERMISSION_KEYS.UPDATE_SPEC, PERMISSION_KEYS.DELETE_SPEC)
          }
        >
          <th className="px-6 py-3 text-center">Thao tác</th>
        </PermissionGate>
      </tr>
    </thead>
  );
}
