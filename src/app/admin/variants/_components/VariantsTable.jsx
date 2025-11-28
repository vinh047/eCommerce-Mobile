"use client";

import { useColumnVisibility } from "@/hooks/useColumnVisibility";
import { ColumnVisibilityMenu } from "@/components/common/ColumnVisibilityMenu";
import Pagination from "@/components/common/Pagination";
import VariantsTableHeader from "./VariantsTableHeader";
import VariantsTableRow from "./VariantsTableRow";

export default function VariantsTable({
  variants,
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
    productName: true,
    color: true,
    price: true,
    stock: true,
    status: true,
    createdAt: false,
  });

  const columnLabels = {
    id: "ID",
    image: "Hình ảnh",
    productName: "Sản phẩm",
    color: "Màu sắc",
    price: "Giá bán",
    stock: "Tồn kho",
    status: "Trạng thái",
    createdAt: "Ngày tạo",
  };

  const handleSelectAll = () => {
    const currentIds = variants.map((v) => v.id);
    const allSelected = currentIds.every((id) => selectedItems.has(id));
    variants.forEach((v) => onSelectItem(v.id, !allSelected));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Danh sách Biến thể
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Tổng: {totalItems} biến thể
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
          <VariantsTableHeader
            columnVisibility={columnVisibility}
            selectedItems={selectedItems}
            currentPageVariants={variants}
            onSelectAll={handleSelectAll}
          />
          <tbody>
            {variants.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  Không có biến thể nào để hiển thị.
                </td>
              </tr>
            ) : (
              variants.map((variant) => (
                <VariantsTableRow
                  key={variant.id}
                  variant={variant}
                  columnVisibility={columnVisibility}
                  isSelected={selectedItems.has(variant.id)}
                  onSelect={(selected) => onSelectItem(variant.id, selected)}
                  onQuickView={() => onQuickView(variant)}
                  onEdit={() => onEdit(variant)}
                  onDelete={() => onDelete(variant.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination totalItems={totalItems} label="biến thể" />
    </div>
  );
}