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

// --- Component Thanh Công cụ (Client Component) ---
export default function UsersToolbar() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Khởi tạo state: Lấy search từ 'search', và status (multi-value) từ 'status' (CSV)
  const initialStatusFromURL = searchParams.get("status");
  const initialStatusArray = initialStatusFromURL
    ? initialStatusFromURL.split(",")
    : [];

  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );
  // Dùng state là mảng để dễ dàng quản lý checkbox
  const [status, setStatus] = useState(initialStatusArray);

  // Kỹ thuật Debouncing cho Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Chỉ cập nhật URL sau khi người dùng ngừng gõ 500ms
      updateURLParams({ search: searchValue });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchValue]);

  // Hàm SỬA LỖI VÀ CẬP NHẬT URL (Sử dụng CSV cho 'status')
  const updateURLParams = (newParams) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      // Xử lý giá trị rỗng/null/mảng rỗng
      if (!value || (Array.isArray(value) && value.length === 0)) {
        params.delete(key);
      } else {
        // Luôn xóa key cũ trước khi set mới
        params.delete(key);

        if (Array.isArray(value)) {
          // *** SỬA LỖI TẠI ĐÂY: Dùng join(',') để tạo CSV ***
          // Ví dụ: ['active', 'blocked'] -> 'active,blocked'
          params.set(key, value.join(","));
        } else {
          // Xử lý giá trị đơn (như 'search')
          params.set(key, value);
        }
      }
    });

    router.replace(`?${params.toString()}`);
  };

  // Chỉ cập nhật state (URL sẽ được cập nhật trong useEffect)
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  // Cập nhật state và URL ngay lập tức cho Dropdown
  const handleStatusChange = (values) => {
    setStatus(values);
    updateURLParams({ status: values });
  };

  const handleClearFilters = () => {
    setSearchValue("");
    setStatus([]);
    // Cập nhật URL ngay lập tức với giá trị rỗng
    updateURLParams({ search: "", status: [] });
  };

  return (
    // Áp dụng Tailwind CSS chi tiết từ File 2
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6 shadow-md">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search Input */}
        <div className="flex-1 min-w-64">
          <div className="relative">
            <input
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Tìm theo tên hoặc Email người dùng..."
              // Áp dụng Tailwind CSS chi tiết từ File 2
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white transition duration-150"
            />
            {/* Icon Tìm kiếm */}
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>

        {/* Bộ lọc và Xóa */}
        <div className="flex items-center space-x-3">
          <FilterDropdown
            label="Trạng thái"
            options={statusOptions}
            selectedValues={status}
            onSelectionChange={handleStatusChange}
          />

          <button
            onClick={handleClearFilters}
            // Áp dụng Tailwind CSS chi tiết từ File 2
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition duration-150 ease-in-out font-medium"
          >
            <i className="fas fa-times mr-2"></i>Xóa bộ lọc
          </button>
        </div>
      </div>
    </div>
  );
}
