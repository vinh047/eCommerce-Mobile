"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { FilterDropdown } from "@/components/common/FilterDropdown";
import { useQueryParams } from "@/hooks/useQueryParams";

export function ToolbarFilter({
  searchPlaceholder = "Tìm kiếm...",
  searchKey = "search",
  filters = [],
}) {
  const { getParam, setParam, updateParams } = useQueryParams();

  // search
  const [searchValue, setSearchValue] = useState(getParam(searchKey) || "");

  // filter state
  const [filterValues, setFilterValues] = useState(
    Object.fromEntries(
      filters.map((f) => [f.key, getParam(f.key)?.split(",") || []])
    )
  );

  // Debounce search
  useEffect(() => {
    const delay = setTimeout(() => {
      setParam(searchKey, searchValue || null);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchValue]);

  const handleFilterChange = (key, values) => {
    setFilterValues((prev) => ({ ...prev, [key]: values }));
    setParam(key, values.length > 0 ? values.join(",") : null);
  };

  const handleClear = () => {
    setSearchValue("");
    const updates = {};
    filters.forEach((f) => {
      updates[f.key] = null;
    });
    updates[searchKey] = null;
    updateParams(updates);
    setFilterValues(Object.fromEntries(filters.map((f) => [f.key, []])));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6 shadow-md">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search Input */}
        <div className="flex-1 min-w-64">
          <div className="relative">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white transition duration-150"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-3">
          {filters.map((f) => (
            <FilterDropdown
              key={f.key}
              label={f.label}
              options={f.options}
              selectedValues={filterValues[f.key] || []}
              onSelectionChange={(values) => handleFilterChange(f.key, values)}
            />
          ))}

          <button
            onClick={handleClear}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition duration-150 ease-in-out font-medium flex items-center cursor-pointer"
          >
            <X className="w-4 h-4 mr-2" />
            Xóa bộ lọc
          </button>
        </div>
      </div>
    </div>
  );
}
