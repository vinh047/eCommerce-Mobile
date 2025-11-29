"use client";

import { useState } from "react";
import ProductTableHeader from "./ProductTableHeader";
import ProductTableRow from "./ProductTableRow";
import LoadingSkeleton from "../common/LoadingSkeleton";
import Pagination from "../common/Pagination";

export default function ProductsTable({
  products,
  selectedItems,
  loading,
  sortConfig,
  currentPage,
  pageSize,
  totalItems,
  onSelectItem,
  onSort,
  onQuickView,
  onEditProduct,
  onDeleteProduct,
  onPageChange,
  onPageSizeChange,
}) {
  const [columnVisibility, setColumnVisibility] = useState({
    id: true,
    name: true,
    brand: true,
    category: true,
    rating: true,
    status: true,
    createdAt: true,
  });

  const [showColumnFilter, setShowColumnFilter] = useState(false);

  const handleColumnVisibilityChange = (column, visible) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [column]: visible,
    }));
  };

  const handleSelectAll = () => {
    const currentPageIds = products.map((p) => p.id);
    const allSelected = currentPageIds.every((id) => selectedItems.has(id));

    if (allSelected) {
      products.forEach((product) => onSelectItem(product.id, false));
    } else {
      products.forEach((product) => onSelectItem(product.id, true));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Danh sách sản phẩm
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Tổng: {totalItems} sản phẩm
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
                          : column === "name"
                          ? "Tên sản phẩm"
                          : column === "brand"
                          ? "Thương hiệu"
                          : column === "category"
                          ? "Danh mục"
                          : column === "rating"
                          ? "Đánh giá"
                          : column === "status"
                          ? "Trạng thái"
                          : column === "createdAt"
                          ? "Ngày tạo"
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
          <ProductTableHeader
            columnVisibility={columnVisibility}
            sortConfig={sortConfig}
            selectedItems={selectedItems}
            currentPageProducts={products} 
            onSort={onSort}
            onSelectAll={handleSelectAll}
          />
          <tbody>
            {loading ? (
              <LoadingSkeleton columnVisibility={columnVisibility} />
            ) : (
              products.map((product) => (
                <ProductTableRow
                  key={product.id}
                  product={product}
                  columnVisibility={columnVisibility}
                  isSelected={selectedItems.has(product.id)}
                  onSelect={(selected) => onSelectItem(product.id, selected)}
                  onQuickView={() => onQuickView(product.id)}
                  onEdit={() => onEditProduct(product.id)}
                  onDelete={() => onDeleteProduct(product.id)}
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
      />
    </div>
  );
}
