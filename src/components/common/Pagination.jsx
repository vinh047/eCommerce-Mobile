"use client";

import { useQueryParams } from "@/hooks/useQueryParams";
import { useMemo } from "react";

export default function Pagination({
  totalItems,
  label = "sản phẩm",
  showPageSizeOptions = true,
}) {
  const { getParam, setParam, updateParams } = useQueryParams();

  const currentPage = parseInt(getParam("page") || "1", 10);
  const pageSize = parseInt(getParam("pageSize") || "10", 10);

  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem =
    totalItems === 0 ? 0 : Math.min(currentPage * pageSize, totalItems);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    if (page === 1) {
      setParam("page", null);
      return;
    }
    setParam("page", page);
  };

  const handlePageSizeChange = (size) => {
    if (size === 10) {
      updateParams({ pageSize: null, page: null });
      return;
    }
    updateParams({ pageSize: size, page: null });
  };

  const getPageNumbers = useMemo(() => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }
    if (currentPage - delta > 2) rangeWithDots.push(1, "…");
    else rangeWithDots.push(1);
    rangeWithDots.push(...range);
    if (currentPage + delta < totalPages - 1)
      rangeWithDots.push("…", totalPages);
    else rangeWithDots.push(totalPages);
    return rangeWithDots;
  }, [currentPage, totalPages]);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
      {showPageSizeOptions && (
        <div className="flex items-center space-x-4 text-sm text-gray-700 dark:text-gray-300">
          Hiển thị {startItem} - {endItem} của {totalItems} {label}/
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Số dòng:
            </label>
            <select
              value={pageSize}
              onChange={(e) => {
                console.log(e.target.value);
                handlePageSizeChange(parseInt(e.target.value));
              }}
              className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:text-white cursor-pointer"
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      <div
        className={`flex items-center space-x-2 ${
          !showPageSizeOptions ? "m-auto" : ""
        }`}
      >
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded text-sm disabled:opacity-50 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer disabled:cursor-not-allowed "
        >
          ← Trước
        </button>

        {getPageNumbers.map((page, i) =>
          page === "…" ? (
            <span key={i} className="px-3 py-1 text-gray-500">
              …
            </span>
          ) : (
            <button
              key={i}
              onClick={() => handlePageChange(page)}
              disabled={currentPage === page}
              className={`px-3 py-1 border rounded text-sm ${
                currentPage === page
                  ? "bg-blue-600 text-white border-blue-600 disabled:cursor-not-allowed"
                  : "border-gray-300 dark:border-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded text-sm disabled:opacity-50 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer disabled:cursor-not-allowed"
        >
          Sau →
        </button>
      </div>
    </div>
  );
}
