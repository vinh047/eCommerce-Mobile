"use client";

import { useColumnVisibility } from "@/hooks/useColumnVisibility";
import { ColumnVisibilityMenu } from "@/components/common/ColumnVisibilityMenu";
import Pagination from "@/components/common/Pagination";
import CategoriesTableHeader from "./CategoriesTableHeader";
import CategoriesTableRow from "./CategoriesTableRow";

export default function CategoriesTable({
  categories,
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
    slug: true,
    parent: true, // Hiển thị cột cha
    icon: true,
    isActive: true,
    productsCount: true,
  });

  const columnLabels = {
    id: "ID",
    name: "Tên danh mục",
    slug: "Slug",
    parent: "Danh mục cha",
    icon: "Icon Key",
    isActive: "Trạng thái",
    productsCount: "Sản phẩm",
  };

  const handleSelectAll = () => {
    const ids = categories.map((c) => c.id);
    const allSelected = ids.every((id) => selectedItems.has(id));
    categories.forEach((c) => onSelectItem(c.id, !allSelected));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Danh sách Danh mục
        </h3>
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
          <CategoriesTableHeader
            columnVisibility={columnVisibility}
            selectedItems={selectedItems}
            currentPageData={categories}
            onSelectAll={handleSelectAll}
          />
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                  Không có danh mục nào.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <CategoriesTableRow
                  key={cat.id}
                  category={cat}
                  columnVisibility={columnVisibility}
                  isSelected={selectedItems.has(cat.id)}
                  onSelect={(sel) => onSelectItem(cat.id, sel)}
                  onQuickView={() => onQuickView(cat)}
                  onEdit={() => onEdit(cat)}
                  onDelete={() => onDelete(cat.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination totalItems={totalItems} label="danh mục" />
    </div>
  );
}