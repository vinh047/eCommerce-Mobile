"use client";

import { useColumnVisibility } from "@/hooks/useColumnVisibility";
import { ColumnVisibilityMenu } from "@/components/common/ColumnVisibilityMenu";
import Pagination from "@/components/common/Pagination";
import ReviewsTableHeader from "./ReviewsTableHeader";
import ReviewsTableRow from "./ReviewsTableRow";

export default function ReviewsTable({
  reviews,
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
    product: true,
    user: true,
    stars: true,
    content: true,
    status: true,
    createdAt: true,
  });

  const columnLabels = {
    id: "ID",
    product: "Sản phẩm",
    user: "Người dùng",
    stars: "Đánh giá",
    content: "Nội dung",
    status: "Trạng thái",
    createdAt: "Ngày tạo",
  };

  const handleSelectAll = () => {
    const currentIds = reviews.map((r) => r.id);
    const allSelected = currentIds.every((id) => selectedItems.has(id));
    reviews.forEach((r) => onSelectItem(r.id, !allSelected));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800">
        <div className="flex items-center space-x-4">
          <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200">
            Danh sách đánh giá
          </h3>
          <span className="bg-gray-100 text-gray-600 py-0.5 px-2.5 rounded-full text-xs font-medium dark:bg-gray-700 dark:text-gray-300">
            {totalItems} mục
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
          <ReviewsTableHeader
            columnVisibility={columnVisibility}
            selectedItems={selectedItems}
            currentPageItems={reviews}
            onSelectAll={handleSelectAll}
          />
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  Không có đánh giá nào.
                </td>
              </tr>
            ) : (
              reviews.map((review) => (
                <ReviewsTableRow
                  key={review.id}
                  review={review}
                  columnVisibility={columnVisibility}
                  isSelected={selectedItems.has(review.id)}
                  onSelect={(selected) => onSelectItem(review.id, selected)}
                  onQuickView={() => onQuickView(review)}
                  onEdit={() => onEdit(review)}
                  onDelete={() => onDelete(review.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination totalItems={totalItems} label="đánh giá" />
    </div>
  );
}