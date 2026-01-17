"use client";

import { useColumnVisibility } from "@/hooks/useColumnVisibility";
import { ColumnVisibilityMenu } from "@/components/common/ColumnVisibilityMenu";
import Pagination from "@/components/common/Pagination";
import CartsTableHeader from "./CartsTableHeader";
import CartsTableRow from "./CartsTableRow";

export default function CartsTable({
  carts, // Dữ liệu cart bao gồm relation: user và items
  selectedItems,
  totalItems,
  onSelectItem,
  onQuickView,
  onDeleteCart,
}) {
  const {
    columnVisibility,
    showColumnFilter,
    toggleColumnFilter,
    handleColumnVisibilityChange,
  } = useColumnVisibility({
    id: true,
    user: true,
    itemsCount: true,
    createdAt: true,
    updatedAt: true,
  });

  const columnLabels = {
    id: "ID Giỏ hàng",
    user: "Người sở hữu",
    itemsCount: "Số lượng SP",
    createdAt: "Ngày tạo",
    updatedAt: "Cập nhật cuối",
  };

  const handleSelectAll = () => {
    const currentPageIds = carts.map((c) => c.id);
    const allSelected = currentPageIds.every((id) => selectedItems.has(id));
    carts.forEach((cart) => onSelectItem(cart.id, !allSelected));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Danh sách Giỏ hàng
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Tổng: {totalItems} bản ghi
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
          <CartsTableHeader
            columnVisibility={columnVisibility}
            selectedItems={selectedItems}
            currentPageCarts={carts}
            onSelectAll={handleSelectAll}
          />
          <tbody>
            {carts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  Không có giỏ hàng nào.
                </td>
              </tr>
            ) : (
              carts.map((cart) => (
                <CartsTableRow
                  key={cart.id}
                  cart={cart}
                  columnVisibility={columnVisibility}
                  isSelected={selectedItems.has(cart.id)}
                  onSelect={(selected) => onSelectItem(cart.id, selected)}
                  onQuickView={() => onQuickView(cart)}
                  onDelete={() => onDeleteCart(cart.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination totalItems={totalItems} label="giỏ hàng" />
    </div>
  );
}