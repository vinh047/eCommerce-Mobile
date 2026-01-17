"use client";

import { useColumnVisibility } from "@/hooks/useColumnVisibility";
import { ColumnVisibilityMenu } from "@/components/common/ColumnVisibilityMenu";
import Pagination from "@/components/common/Pagination";
import RmasTableHeader from "./RmasTableHeader";
import RmasTableRow from "./RmasTableRow";

export default function RmasTable({
  rmas,
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
    order: true,
    item: true,
    type: true,
    reason: true,
    status: true,
    createdAt: true,
  });

  const columnLabels = {
    id: "ID",
    order: "Đơn hàng",
    item: "Sản phẩm",
    type: "Loại yêu cầu",
    reason: "Lý do",
    status: "Trạng thái",
    createdAt: "Ngày gửi",
  };

  const handleSelectAll = () => {
    const currentIds = rmas.map((r) => r.id);
    const allSelected = currentIds.every((id) => selectedItems.has(id));
    rmas.forEach((r) => onSelectItem(r.id, !allSelected));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800">
        <div className="flex items-center space-x-4">
          <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200">
            Danh sách yêu cầu
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
          <RmasTableHeader
            columnVisibility={columnVisibility}
            selectedItems={selectedItems}
            currentPageItems={rmas}
            onSelectAll={handleSelectAll}
          />
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {rmas.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  Không có yêu cầu nào.
                </td>
              </tr>
            ) : (
              rmas.map((rma) => (
                <RmasTableRow
                  key={rma.id}
                  rma={rma}
                  columnVisibility={columnVisibility}
                  isSelected={selectedItems.has(rma.id)}
                  onSelect={(selected) => onSelectItem(rma.id, selected)}
                  onQuickView={() => onQuickView(rma)}
                  onEdit={() => onEdit(rma)}
                  onDelete={() => onDelete(rma.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination totalItems={totalItems} label="yêu cầu" />
    </div>
  );
}