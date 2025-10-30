"use client";

import { useState } from "react";

import Pagination from "../../../../components/common/Pagination";
import { User } from "lucide-react";
import UsersTableHeader from "./UsersTableHeader";
import UsersTableRow from "./UsersTableRow";

export default function UsersTable({
  users,
  selectedItems,
  sortConfig,
  currentPage,
  pageSize,
  totalItems,
  onSelectItem,
  onSort,
  onQuickView,
  onEditUser,
  onDeleteUser,
  onPageChange,
  onPageSizeChange,
}) {
  const [columnVisibility, setColumnVisibility] = useState({
    id: true,
    name: true,
    email: true,
    status: true,
    createdAt: true,
  });

  const [showColumnFilter, setShowColumnFilter] = useState(false);

  const handleColumnVisibilityChange = (column, visible) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [column]: visible,
    }));
  };

  const handleSelectAll = () => {
    const currentPageIds = users.map((u) => u.id);
    const allSelected = currentPageIds.every((id) => selectedItems.has(id));

    if (allSelected) {
      users.forEach((user) => onSelectItem(user.id, false));
    } else {
      users.forEach((user) => onSelectItem(user.id, true));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Danh sách người dùng
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Tổng: {totalItems} người dùng
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
                        {column === "id"
                          ? "ID"
                          : column === "name"
                          ? "Tên người dùng"
                          : column === "email"
                          ? "Email"
                          : column === "status"
                          ? "Trạng thái"
                          : column === "createdAt"
                          ? "Ngày tạo"
                          : column}
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
          <UsersTableHeader
            columnVisibility={columnVisibility}
            sortConfig={sortConfig}
            selectedItems={selectedItems}
            currentPageUsers={users}
            onSort={onSort}
            onSelectAll={handleSelectAll}
          ></UsersTableHeader>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  Không có người dùng nào để hiển thị.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <UsersTableRow
                  key={user.id}
                  user={user}
                  columnVisibility={columnVisibility}
                  isSelected={selectedItems.has(user.id)}
                  onSelect={(selected) => onSelectItem(user.id, selected)}
                  onQuickView={() => onQuickView(user)}
                  onEdit={() => onEditUser(user)}
                  onDelete={() => onDeleteUser(user.id)}
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
        label="người dùng"
      />
    </div>
  );
}
