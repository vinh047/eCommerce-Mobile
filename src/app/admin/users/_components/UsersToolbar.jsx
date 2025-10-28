"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// --- Dữ liệu Tùy chọn ---
const statusOptions = [
  { value: "active", label: "Hoạt động" },
  { value: "blocked", label: "Đã khóa" },
];

// --- Component Dropdown Lọc (Client Component) ---
function FilterDropdown({ label, options, selectedValues, onSelectionChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleCheckboxChange = (value, checked) => {
    const newValues = checked
      ? [...selectedValues, value]
      : selectedValues.filter((v) => v !== value);
    onSelectionChange(newValues);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        // Áp dụng Tailwind CSS chi tiết từ File 2
        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 bg-white dark:bg-gray-700 dark:text-white cursor-pointer transition duration-150 ease-in-out"
      >
        <span>{label}</span>
        <i
          className={`fas fa-chevron-down text-sm transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        ></i>
      </button>

      {isOpen && (
        // Áp dụng Tailwind CSS chi tiết từ File 2
        <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl z-20">
          <div className="p-3 space-y-2">
            {options.map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 rounded p-1 -m-1 transition duration-100"
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={(e) =>
                    handleCheckboxChange(option.value, e.target.checked)
                  }
                  // Áp dụng Tailwind CSS chi tiết từ File 2
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
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
  onFilterChange,
  statusOptions = [
    { value: "active", label: "Hoạt động" },
    { value: "blocked", label: "Đã khóa" },
  ],
}) {
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const [status, setStatus] = useState(filters.statusQuery || []);
  const debounceRef = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      onFilterChange({
        ...filters,
        search: value,
      });
    }, 500);
  };

  const handleStatusChange = (values) => {
    setStatus(values);
    onFilterChange({
      ...filters,
      statusQuery: values,
    });
  };

  const handleClearFilters = () => {
    setSearchValue("");
    setStatus([]);
    onFilterChange({ search: "", statusQuery: [] });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
      <div className="flex gap-4 items-center">
        <input
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="Tìm kiếm người dùng..."
          className="flex-1 rounded-lg px-3 py-2 dark:bg-gray-700"
        />

        <FilterDropdown
          label="Trạng thái"
          options={statusOptions}
          selectedValues={status}
          onSelectionChange={handleStatusChange}
        />

        <button
          onClick={handleClearFilters}
          className="text-gray-500 hover:text-red-500 transition cursor-pointer"
        >
          <i className="fas fa-times mr-1" /> Xóa bộ lọc
        </button>
      </div>
    </div>
  );
}
