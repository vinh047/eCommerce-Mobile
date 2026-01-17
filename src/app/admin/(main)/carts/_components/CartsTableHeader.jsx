"use client";

import { useQueryParams } from "@/hooks/useQueryParams";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

export default function CartsTableHeader({
  columnVisibility,
  selectedItems,
  currentPageCarts,
  onSelectAll,
}) {
  const { getParam, setParam } = useQueryParams();

  // Lấy trạng thái sort từ URL (ví dụ: "createdAt:desc")
  const sortParam = getParam("sort") || "";
  const [sortColumn, sortDirection] = sortParam.split(":");

  // Kiểm tra trạng thái checkbox "Chọn tất cả"
  const currentPageIds = currentPageCarts.map((c) => c.id);
  const allSelected =
    currentPageIds.length > 0 &&
    currentPageIds.every((id) => selectedItems.has(id));
  const someSelected = currentPageIds.some((id) => selectedItems.has(id));

  // Xử lý khi click vào tiêu đề cột để sắp xếp
  const handleSort = (column) => {
    // Chỉ cho phép sort các cột có trong database và logic API
    if (!["id", "createdAt", "updatedAt"].includes(column)) return;

    if (sortColumn !== column) {
      setParam("sort", `${column}:desc`);
    } else if (sortDirection === "desc") {
      setParam("sort", `${column}:asc`);
    } else {
      setParam("sort", null); // Bỏ sort
    }
  };

  // Icon hiển thị trạng thái sort
  const getSortIcon = (column) => {
    // Các cột không hỗ trợ sort (như User name, Items count nếu không join) thì không hiện icon
    if (!["id", "createdAt", "updatedAt"].includes(column)) return null;

    if (sortColumn !== column) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400 ml-1" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-4 h-4 text-blue-600 ml-1" />
    ) : (
      <ArrowDown className="w-4 h-4 text-blue-600 ml-1" />
    );
  };

  return (
    <thead className="bg-gray-50 dark:bg-gray-700">
      <tr>
        {/* Checkbox chọn tất cả */}
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

        {/* Cột ID */}
        {columnVisibility.id && (
          <th
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            onClick={() => handleSort("id")}
          >
            <div className="flex items-center">
              <span>ID</span>
              {getSortIcon("id")}
            </div>
          </th>
        )}

        {/* Cột Người sở hữu (User) */}
        {columnVisibility.user && (
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            <div className="flex items-center">
              <span>Người sở hữu</span>
              {/* User thường sort phức tạp (relation), nên có thể disable sort client đơn giản hoặc cần API hỗ trợ */}
            </div>
          </th>
        )}

        {/* Cột Số lượng Items */}
        {columnVisibility.itemsCount && (
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            <span>Số lượng SP</span>
          </th>
        )}

        {/* Cột Ngày tạo */}
        {columnVisibility.createdAt && (
          <th
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            onClick={() => handleSort("createdAt")}
          >
            <div className="flex items-center">
              <span>Ngày tạo</span>
              {getSortIcon("createdAt")}
            </div>
          </th>
        )}

        {/* Cột Thao tác */}
        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24">
          Thao tác
        </th>
      </tr>
    </thead>
  );
}
