"use client";

import { useColumnVisibility } from "@/hooks/useColumnVisibility";
import { ColumnVisibilityMenu } from "@/components/common/ColumnVisibilityMenu";
import Pagination from "@/components/common/Pagination";
import UsersTableHeader from "./UsersTableHeader";
import UsersTableRow from "./UsersTableRow";

export default function UsersTable({
  users,
  selectedItems,
  totalItems,
  onSelectItem,
  onQuickView,
  onEditUser,
  onDeleteUser,
}) {
  const {
    columnVisibility,
    showColumnFilter,
    toggleColumnFilter,
    handleColumnVisibilityChange,
  } = useColumnVisibility({
    id: true,
    name: true,
    email: true,
    status: true,
    createdAt: true,
  });

  const columnLabels = {
    id: "ID",
    name: "Tên người dùng",
    email: "Email",
    status: "Trạng thái",
    createdAt: "Ngày tạo",
  };

  const handleSelectAll = () => {
    const currentPageIds = users.map((u) => u.id);
    const allSelected = currentPageIds.every((id) => selectedItems.has(id));

    users.forEach((user) => onSelectItem(user.id, !allSelected));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Danh sách người dùng
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Tổng: {totalItems} người dùng
          </span>
        </div>

        <ColumnVisibilityMenu
          columnVisibility={columnVisibility}
          showColumnFilter={showColumnFilter}
          toggleColumnFilter={toggleColumnFilter}
          handleColumnVisibilityChange={handleColumnVisibilityChange}
          columnLabels={columnLabels}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <UsersTableHeader
            columnVisibility={columnVisibility}
            selectedItems={selectedItems}
            currentPageUsers={users}
            onSelectAll={handleSelectAll}
          />
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

      <Pagination totalItems={totalItems} label="người dùng" />
    </div>
  );
}
