"use client";

import { useQueryParams } from "@/hooks/useQueryParams";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

export default function VariantsTableHeader({
  columnVisibility,
  selectedItems,
  currentPageVariants,
  onSelectAll,
}) {
  const { getParam, setParam } = useQueryParams();

  const sortParam = getParam("sort") || "";
  const [sortColumn, sortDirection] = sortParam.split(":");

  const currentPageIds = currentPageVariants.map((v) => v.id);
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
    if (sortColumn !== column) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ArrowDown className="w-4 h-4 text-blue-600" />
    );
  };

  const ThSortable = ({ column, label }) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        {getSortIcon(column)}
      </div>
    </th>
  );

  return (
    <thead className="bg-gray-50 dark:bg-gray-700">
      <tr>
        {/* Checkbox chọn tất cả */}
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

        {columnVisibility.id && <ThSortable column="id" label="ID" />}

        {/* Hình ảnh (Không sort) */}
        {columnVisibility.image && (
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Hình ảnh
          </th>
        )}

        {columnVisibility.productName && <ThSortable column="productName" label="Sản phẩm" />}

        {columnVisibility.color && <ThSortable column="color" label="Màu sắc" />}

        {columnVisibility.price && <ThSortable column="price" label="Giá bán" />}

        {columnVisibility.stock && <ThSortable column="stock" label="Tồn kho" />}

        {columnVisibility.status && <ThSortable column="isActive" label="Trạng thái" />}

        {columnVisibility.createdAt && <ThSortable column="createdAt" label="Ngày tạo" />}

        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
          Thao tác
        </th>
      </tr>
    </thead>
  );
}