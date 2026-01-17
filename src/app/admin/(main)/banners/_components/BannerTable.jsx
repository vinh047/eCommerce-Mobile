"use client";

import { useColumnVisibility } from "@/hooks/useColumnVisibility";
import { ColumnVisibilityMenu } from "@/components/common/ColumnVisibilityMenu";
import Pagination from "@/components/common/Pagination";
import BannerTableHeader from "./BannerTableHeader";
import BannerTableRow from "./BannerTableRow";

export default function BannerTable({
  banners,
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
    image: true,
    altText: true,
    product: true,
    displayOrder: true,
    isActive: true,
  });

  const columnLabels = {
    id: "ID",
    image: "Hình ảnh",
    altText: "Mô tả (Alt)",
    product: "Sản phẩm liên kết",
    displayOrder: "Thứ tự",
    isActive: "Trạng thái",
  };

  const handleSelectAll = () => {
    const currentPageIds = banners.map((b) => b.id);
    const allSelected = currentPageIds.every((id) => selectedItems.has(id));
    banners.forEach((banner) => onSelectItem(banner.id, !allSelected));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800">
        <div className="flex items-center space-x-4">
          <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200">
            Danh sách Banner
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
          <BannerTableHeader
            columnVisibility={columnVisibility}
            selectedItems={selectedItems}
            currentPageItems={banners}
            onSelectAll={handleSelectAll}
          />
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {banners.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <p className="mt-2 text-sm">Chưa có banner nào.</p>
                  </div>
                </td>
              </tr>
            ) : (
              banners.map((banner) => (
                <BannerTableRow
                  key={banner.id}
                  banner={banner}
                  columnVisibility={columnVisibility}
                  isSelected={selectedItems.has(banner.id)}
                  onSelect={(selected) => onSelectItem(banner.id, selected)}
                  onQuickView={() => onQuickView(banner)}
                  onEdit={() => onEdit(banner)}
                  onDelete={() => onDelete(banner.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination totalItems={totalItems} label="banner" />
    </div>
  );
}