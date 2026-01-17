"use client";

import { useState } from "react";
import ProductsTableHeader from "./ProductsTableHeader";
import ProductsTableRow from "./ProductsTableRow";
import Pagination from "@/components/common/Pagination";

export default function ProductsTable({ products = [], onDelete, totalItems }) {
  const [selectedItems, setSelectedItems] = useState(new Set());

  // Xử lý chọn tất cả
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = new Set(products.map((p) => p.id));
      setSelectedItems(allIds);
    } else {
      setSelectedItems(new Set());
    }
  };

  // Xử lý chọn từng dòng
  const handleSelectRow = (id, checked) => {
    const newSelected = new Set(selectedItems);
    if (checked) newSelected.add(id);
    else newSelected.delete(id);
    setSelectedItems(newSelected);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <ProductsTableHeader
            selectedItems={selectedItems}
            currentPageData={products}
            onSelectAll={handleSelectAll}
          />
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductsTableRow
                  key={product.id}
                  product={product}
                  isSelected={selectedItems.has(product.id)}
                  onSelect={(checked) => handleSelectRow(product.id, checked)}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  Không có sản phẩm nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Thanh hiển thị số lượng đã chọn (Optional) */}
      {selectedItems.size > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 px-6 py-2 text-xs text-blue-700 dark:text-blue-300 border-t border-blue-100 dark:border-blue-800 flex justify-between">
          <span>
            Đang chọn: <b>{selectedItems.size}</b> sản phẩm
          </span>
          {/* Có thể thêm nút "Xóa nhiều" ở đây */}
        </div>
      )}

      <Pagination totalItems={totalItems} label="sản phẩm" />
    </div>
  );
}
