"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

// Định nghĩa các tùy chọn sắp xếp
const SORT_OPTIONS = [
  { label: "Mới nhất", value: "latest" },
  { label: "Giá: Thấp đến cao", value: "price-asc" },
  { label: "Giá: Cao đến thấp", value: "price-desc" },
];

export default function SortDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "latest";

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      // Reset về trang 1 mỗi khi thay đổi bộ lọc
      params.set("page", "1");
      return params.toString();
    },
    [searchParams]
  );

  const handleSortChange = (e) => {
    const newSortValue = e.target.value;
    router.push(pathname + "?" + createQueryString("sort", newSortValue));
  };

  return (
    <div className="flex items-center gap-x-2">
      <label
        htmlFor="sort-by"
        className="text-sm font-medium text-gray-700 whitespace-nowrap"
      >
        Sắp xếp theo
      </label>
      <div className="relative">
        <select
          id="sort-by"
          value={currentSort}
          onChange={handleSortChange}
          className="appearance-none block w-48 rounded-lg border border-gray-300 bg-white py-1.5 pl-3 pr-10 text-sm text-gray-800 shadow-sm
                     transition-colors duration-150 ease-in-out
                     hover:border-gray-400
                     focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {/*  Icon mũi tên thay thế */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
