"use client";

import { useState } from "react";

import Pagination from "../../../../components/common/Pagination";
import { Tag } from "lucide-react";
import CouponsTableHeader from "./CouponsTableHeader";
import CouponsTableRow from "./CouponsTableRow";
import LoadingSkeleton from "../../../../components/common/LoadingSkeleton";

export default function CouponsTable({
  coupons,
  selectedItems,
  loading,
  sortConfig,
  currentPage,
  pageSize,
  totalItems,
  onSelectItem,
  onSort,
  onQuickView,
  onEditCoupon,
  onDeleteCoupon,
  onPageChange,
  onPageSizeChange,
}) {
  const [columnVisibility, setColumnVisibility] = useState({
    id: true,
    code: true,
    value: true,
    type: true,
    usageLimit: true,
    status: true,
    endsAt: true,
  });

  const [showColumnFilter, setShowColumnFilter] = useState(false);

  const handleColumnVisibilityChange = (column, visible) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [column]: visible,
    }));
  };

  const handleSelectAll = () => {
    const currentPageIds = coupons.map((c) => c.id);
    const allSelected = currentPageIds.every((id) => selectedItems.has(id));

    if (allSelected) {
      coupons.forEach((coupon) => onSelectItem(coupon.id, false));
    } else {
      coupons.forEach((coupon) => onSelectItem(coupon.id, true));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Danh sách Mã giảm giá
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Tổng: {totalItems} mã giảm giá
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
                          : column === "code"
                          ? "Mã giảm giá"
                          : column === "value"
                          ? "Giá trị"
                          : column === "type"
                          ? "Loại"
                          : column === "usageLimit"
                          ? "Giới hạn"
                          : column === "status"
                          ? "Trạng thái"
                          : column === "endsAt"
                          ? "Hết hạn"
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
          <CouponsTableHeader
            columnVisibility={columnVisibility}
            sortConfig={sortConfig}
            selectedItems={selectedItems}
            currentPageCoupons={coupons}
            onSort={onSort}
            onSelectAll={handleSelectAll}
          />
          <tbody>
            {loading ? (
              <LoadingSkeleton columnVisibility={columnVisibility} />
            ) : (
              coupons.map((coupon) => (
                <CouponsTableRow
                  key={coupon.id}
                  coupon={coupon}
                  columnVisibility={columnVisibility}
                  isSelected={selectedItems.has(coupon.id)}
                  onSelect={(selected) => onSelectItem(coupon.id, selected)}
                  onQuickView={() => onQuickView(coupon.id)}
                  onEdit={() => onEditCoupon(coupon.id)}
                  onDelete={() => onDeleteCoupon(coupon.id)}
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
        label="mã giảm giá"
      />
    </div>
  );
}
