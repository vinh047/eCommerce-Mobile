"use client";

import { useColumnVisibility } from "@/hooks/useColumnVisibility";
import { ColumnVisibilityMenu } from "@/components/common/ColumnVisibilityMenu";
import Pagination from "@/components/common/Pagination";
import StaffTableHeader from "./StaffTableHeader";
import StaffTableRow from "./StaffTableRow";

export default function StaffTable({
  staffs,
  selectedItems,
  totalItems,
  onSelectItem,
  onQuickView,
  onEdit,
  onDelete,
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
    roles: true,
    status: true,
    createdAt: true,
  });

  const columnLabels = {
    id: "ID",
    name: "Nhân viên",
    email: "Email",
    roles: "Vai trò",
    status: "Trạng thái",
    createdAt: "Ngày tạo",
  };

  const handleSelectAll = () => {
    const currentPageIds = staffs.map((u) => u.id);
    const allSelected = currentPageIds.every((id) => selectedItems.has(id));
    staffs.forEach((staff) => onSelectItem(staff.id, !allSelected));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800">
        <div className="flex items-center space-x-4">
          <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200">
            Danh sách nhân sự
          </h3>
          <span className="bg-gray-100 text-gray-600 py-0.5 px-2.5 rounded-full text-xs font-medium dark:bg-gray-700 dark:text-gray-300">
            {totalItems} records
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

      <div className="overflow-x-auto">
        <table className="w-full">
          <StaffTableHeader
            columnVisibility={columnVisibility}
            selectedItems={selectedItems}
            currentPageItems={staffs}
            onSelectAll={handleSelectAll}
          />
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {staffs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <p className="mt-2 text-sm">Không tìm thấy nhân viên nào.</p>
                  </div>
                </td>
              </tr>
            ) : (
              staffs.map((staff) => (
                <StaffTableRow
                  key={staff.id}
                  staff={staff}
                  columnVisibility={columnVisibility}
                  isSelected={selectedItems.has(staff.id)}
                  onSelect={(selected) => onSelectItem(staff.id, selected)}
                  onQuickView={() => onQuickView(staff)}
                  onEdit={() => onEdit(staff)}
                  onDelete={() => onDelete(staff.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination totalItems={totalItems} label="nhân viên" />
    </div>
  );
}