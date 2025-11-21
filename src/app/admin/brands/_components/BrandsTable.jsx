"use client";

import { useColumnVisibility } from "@/hooks/useColumnVisibility";
import { ColumnVisibilityMenu } from "@/components/common/ColumnVisibilityMenu";
import Pagination from "@/components/common/Pagination";
import BrandsTableHeader from "./BrandsTableHeader";
import BrandsTableRow from "./BrandsTableRow";

export default function BrandsTable({
  brands,
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
    isActive: true,
    productsCount: true, 
    createdAt: true,
  });

  const columnLabels = {
    id: "ID",
    name: "Tên thương hiệu",
    slug: "Slug",
    isActive: "Trạng thái",
    productsCount: "Sản phẩm",
    createdAt: "Ngày tạo",
  };

  const handleSelectAll = () => {
    const currentIds = brands.map((b) => b.id);
    const allSelected = currentIds.every((id) => selectedItems.has(id));
    brands.forEach((brand) => onSelectItem(brand.id, !allSelected));
  };
  console.log(brands);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Danh sách Thương hiệu
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
          <BrandsTableHeader
            columnVisibility={columnVisibility}
            selectedItems={selectedItems}
            currentPageData={brands}
            onSelectAll={handleSelectAll}
          />
          <tbody>
            {brands.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  Không có thương hiệu nào.
                </td>
              </tr>
            ) : (
              brands.map((brand) => (
                <BrandsTableRow
                  key={brand.id}
                  brand={brand}
                  columnVisibility={columnVisibility}
                  isSelected={selectedItems.has(brand.id)}
                  onSelect={(selected) => onSelectItem(brand.id, selected)}
                  onQuickView={() => onQuickView(brand)}
                  onEdit={() => onEdit(brand)}
                  onDelete={() => onDelete(brand.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination totalItems={totalItems} label="thương hiệu" />
    </div>
  );
}
