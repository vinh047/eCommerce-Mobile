"use client";

import { useState } from "react";
import SpecsTableHeader from "./SpecsTableHeader";
import SpecsTableRow from "./SpecsTableRow";
import Pagination from "@/components/common/Pagination";

export default function SpecsTable({
  specs = [],
  totalItems,
  onEdit,
  onConfigure,
  onDelete,
}) {
  // State lưu trữ các ID được chọn
  const [selectedItems, setSelectedItems] = useState(new Set());

  // Xử lý chọn tất cả
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = new Set(specs.map((spec) => spec.id));
      setSelectedItems(allIds);
    } else {
      setSelectedItems(new Set());
    }
  };

  // Xử lý chọn từng dòng
  const handleSelectRow = (id, checked) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedItems(newSelected);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          {/* Gọi Component Header */}
          <SpecsTableHeader
            selectedItems={selectedItems}
            currentPageData={specs}
            onSelectAll={handleSelectAll}
          />

          {/* Gọi Component Rows */}
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {specs.length > 0 ? (
              specs.map((spec) => (
                <SpecsTableRow
                  key={spec.id}
                  spec={spec}
                  isSelected={selectedItems.has(spec.id)}
                  onSelect={(checked) => handleSelectRow(spec.id, checked)}
                  onEdit={onEdit}
                  onConfigure={onConfigure}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  Không có dữ liệu hiển thị
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Hiển thị số lượng đang chọn (Optional) */}
      {selectedItems.size > 0 && (
        <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
          Đang chọn:{" "}
          <span className="font-medium text-blue-600">
            {selectedItems.size}
          </span>{" "}
          mục
        </div>
      )}
      <Pagination totalItems={totalItems} label="thông số" />
    </div>
  );
}
