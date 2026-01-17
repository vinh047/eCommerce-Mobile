// src/pages/permissions/_components/PermissionsTable.jsx
"use client";

import { useState } from "react";

import Pagination from "../../../../../components/common/Pagination";
// Import icons cần thiết
import { Shield } from "lucide-react";
import PermissionsTableHeader from "./PermissionsTableHeader"; // Đã tạo ở trên
import PermissionsTableRow from "./PermissionsTableRow"; // Cần tạo thêm
import LoadingSkeleton from "../../../../../components/common/LoadingSkeleton";

export default function PermissionsTable({
  permissions, // Danh sách Quyền hạn
  selectedItems,
  loading,
  sortConfig,
  currentPage,
  pageSize,
  totalItems,
  onSelectItem,
  onSort,
  onEditPermission, // Thay thế onEditCoupon
  onDeletePermission, // Thay thế onDeleteCoupon
  onPageChange,
  onPageSizeChange,
}) {
  const [columnVisibility, setColumnVisibility] = useState({
    id: true,
    key: true,
    name: true,
    description: true,
    createdAt: true,
  });

  const [showColumnFilter, setShowColumnFilter] = useState(false);

  const handleColumnVisibilityChange = (column, visible) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [column]: visible,
    }));
  };

  // Logic chọn tất cả trên trang hiện tại
  const handleSelectAll = () => {
    const currentPageIds = permissions.map((p) => p.id);
    const allSelected = currentPageIds.every((id) => selectedItems.has(id));

    if (allSelected) {
      permissions.forEach((permission) => onSelectItem(permission.id, false));
    } else {
      permissions.forEach((permission) => onSelectItem(permission.id, true));
    }
  };

  const getColumnName = (column) => {
    switch (column) {
      case "id":
        return "ID";
      case "key":
        return "Key";
      case "name":
        return "Tên";
      case "description":
        return "Mô tả";
      case "createdAt":
        return "Ngày tạo";
      default:
        return column;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Danh sách Quyền hạn
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Tổng: {totalItems} quyền hạn
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {/* Column Visibility */}
          <div className="relative">
            <button
              onClick={() => setShowColumnFilter(!showColumnFilter)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <i className="fas fa-columns"></i>
            </button>
            {showColumnFilter && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
                <div className="p-3 space-y-2">
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Hiển thị cột
                  </div>
                  {Object.entries(columnVisibility).map(([column, visible]) => (
                    <label key={column} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={visible}
                        onChange={(e) =>
                          handleColumnVisibilityChange(column, e.target.checked)
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm dark:text-white capitalize">
                        {getColumnName(column)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <PermissionsTableHeader
            columnVisibility={columnVisibility}
            sortConfig={sortConfig}
            selectedItems={selectedItems}
            currentPagePermissions={permissions}
            onSort={onSort}
            onSelectAll={handleSelectAll}
          />
          <tbody>
            {loading ? (
              <LoadingSkeleton columnVisibility={columnVisibility} />
            ) : (
              permissions.map((permission) => (
                <PermissionsTableRow
                  key={permission.id}
                  permission={permission}
                  columnVisibility={columnVisibility}
                  isSelected={selectedItems.has(permission.id)}
                  onSelect={(selected) => onSelectItem(permission.id, selected)}
                  // Không dùng QuickView cho Permission, dùng Edit trực tiếp
                  onEdit={() => onEditPermission(permission.id)}
                  onDelete={() => onDeletePermission(permission.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        label="quyền hạn"
      />
    </div>
  );
}
