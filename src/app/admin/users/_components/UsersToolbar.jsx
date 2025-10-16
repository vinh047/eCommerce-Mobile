"use client";

import { useState } from "react";

// Tùy chọn giả định cho User (Người dùng)
const statusOptions = [
  { value: "active", label: "Hoạt động" },
  { value: "blocked", label: "Đã khóa" },
];

const genderOptions = [
  { value: "male", label: "Nam" },
  { value: "female", label: "Nữ" },
  { value: "other", label: "Khác" },
];

/**
 * Component FilterDropdown được tái sử dụng để hiển thị các tùy chọn lọc dạng checkbox
 */
function FilterDropdown({
  label,
  options,
  selectedValues,
  onSelectionChange,
  isOpen,
  onToggle,
}) {
  const handleCheckboxChange = (value, checked) => {
    let newValues;
    if (checked) {
      newValues = [...selectedValues, value];
    } else {
      newValues = selectedValues.filter((v) => v !== value);
    }
    onSelectionChange(newValues);
  };

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 bg-white dark:bg-gray-700 dark:text-white"
      >
        <span>{label}</span>
        <i className="fas fa-chevron-down text-sm"></i>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
          <div className="p-3 space-y-2">
            {options.map((option) => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={(e) =>
                    handleCheckboxChange(option.value, e.target.checked)
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm dark:text-white">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function UsersToolbar({
  filters,
  onFiltersChange,
  onClearFilters,
}) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchValue, setSearchValue] = useState(filters.search || "");

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

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
    onClearFilters();
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
              placeholder="Tìm theo tên hoặc Email người dùng..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
            />
            <i className="fas fa-search absolute left-3 top-2.5 text-gray-400"></i>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="flex items-center space-x-3">
          {/* Status Filter */}
          <FilterDropdown
            label="Trạng thái"
            options={statusOptions}
            selectedValues={filters.status || []}
            onSelectionChange={(values) =>
              onFiltersChange({ ...filters, status: values })
            }
            isOpen={openDropdown === "status"}
            onToggle={() => toggleDropdown("status")}
          />

          {/* Gender Filter - Sử dụng Select thay vì Dropdown Checkbox để đơn giản */}
          <div className="relative">
            <select
              value={filters.gender || ""}
              onChange={(e) =>
                onFiltersChange({ ...filters, gender: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
            >
              <option value="">Giới tính</option>
              {genderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <i className="fas fa-times mr-2"></i>Xóa bộ lọc
          </button>
        </div>
      </div>
    </div>
  );
}
