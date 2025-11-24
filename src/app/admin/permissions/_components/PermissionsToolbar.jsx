// src/pages/permissions/_components/PermissionsToolbar.jsx
"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

// Không cần FilterDropdown phức tạp vì Permission không có nhiều status/type

export default function PermissionsToolbar({
  filters,
  onFiltersChange,
  onClearFilters,
}) {
  const [searchValue, setSearchValue] = useState(filters.search || "");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onFiltersChange({
      ...filters,
      search: value,
    });
  };

  const handleClearFilters = () => {
    setSearchValue("");
    onClearFilters(); // Đặt filters về trạng thái mặc định: { search: "" }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="flex-1 min-w-64">
          <div className="relative">
            <input
              type="text"
              value={searchValue}
              onChange={handleSearch}
              placeholder="Tìm theo Key (Khóa) hoặc Tên Quyền hạn..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Clear Filters */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer flex items-center"
          >
            <X className="w-4 h-4 mr-2" />
            Xóa bộ lọc
          </button>
        </div>
      </div>
    </div>
  );
}
