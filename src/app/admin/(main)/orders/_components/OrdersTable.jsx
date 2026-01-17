"use client";

import { useColumnVisibility } from "@/hooks/useColumnVisibility";
import { ColumnVisibilityMenu } from "@/components/common/ColumnVisibilityMenu";
import Pagination from "@/components/common/Pagination";
import OrdersTableHeader from "./OrdersTableHeader";
import OrdersTableRow from "./OrdersTableRow";

export default function OrdersTable({
  orders,
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
    code: true,
    user: true,
    total: true,
    status: true,
    payment: true,
    shipping: true,
    createdAt: true,
  });

  const columnLabels = {
    code: "Mã đơn",
    user: "Khách hàng",
    total: "Tổng tiền",
    status: "Trạng thái",
    payment: "Thanh toán",
    shipping: "Vận chuyển",
    createdAt: "Ngày tạo",
  };

  const handleSelectAll = () => {
    const currentPageIds = orders.map((o) => o.id);
    const allSelected = currentPageIds.every((id) => selectedItems.has(id));
    orders.forEach((order) => onSelectItem(order.id, !allSelected));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800">
        <div className="flex items-center space-x-4">
          <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200">
            Danh sách đơn hàng
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
          <OrdersTableHeader
            columnVisibility={columnVisibility}
            selectedItems={selectedItems}
            currentPageItems={orders}
            onSelectAll={handleSelectAll}
          />
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <p className="mt-2 text-sm">Chưa có đơn hàng nào.</p>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <OrdersTableRow
                  key={order.id}
                  order={order}
                  columnVisibility={columnVisibility}
                  isSelected={selectedItems.has(order.id)}
                  onSelect={(selected) => onSelectItem(order.id, selected)}
                  onQuickView={() => onQuickView(order)}
                  onEdit={() => onEdit(order)}
                  onDelete={() => onDelete(order.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination totalItems={totalItems} label="đơn hàng" />
    </div>
  );
}