"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

/**
 * Hook quản lý sort / filter / pagination thông qua URL.
 * URL là Nguồn Sự Thật (Source of Truth) cho trạng thái bảng.
 */
export function useTableState(initialState = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // =========================================================
  // 1. READ: Trạng thái hiện tại (Đọc trực tiếp từ URL)
  // =========================================================

  const page = Number(searchParams.get("page")) || initialState.page || 1;
  const pageSize =
    Number(searchParams.get("pageSize")) || initialState.pageSize || 10;

  const sortParam = searchParams.get("sort") || initialState.sort || "id:asc";
  const [sortColumn, sortDirection] = sortParam.split(":");

  // Xác định các key thuộc về trạng thái bảng (sẽ bị bỏ qua khi tạo filters)
  const IGNORED_KEYS = new Set(["page", "pageSize", "sort"]);

  // Lấy tất cả các key cần đọc làm bộ lọc: keys từ initialState và key 'search'
  const defaultFilterKeys = new Set([
    "search",
    // Lọc các keys của initialState không phải là trạng thái bảng
    ...Object.keys(initialState).filter((key) => !IGNORED_KEYS.has(key)),
  ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filters = {};
  defaultFilterKeys.forEach((key) => {
    const urlValue = searchParams.get(key);

    // Ưu tiên: 1. Giá trị từ URL > 2. Giá trị mặc định > 3. Chuỗi rỗng
    filters[key] = urlValue || initialState[key] || "";
  });

  // =========================================================
  // 2. LOGIC CẬP NHẬT URL (Update Function)
  // =========================================================

  const updateUrlParams = useCallback(
    (newParams, options = {}) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        if (
          value === undefined ||
          value === null ||
          value === "" ||
          (Array.isArray(value) && value.length === 0)
        ) {
          params.delete(key);
        } else if (Array.isArray(value)) {
          params.set(key, value.join(","));
        } else {
          params.set(key, String(value));
        }
      });

      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
        ...options,
      });
    },
    [router, pathname, searchParams]
  );

  // =========================================================
  // 3. HANDLERS (Write Interface)
  // =========================================================

  const onPageChange = useCallback(
    (newPage) => {
      if (newPage === 1) {
        updateUrlParams({ page: "" });
      } else {
        updateUrlParams({ page: newPage });
      }
    },
    [updateUrlParams]
  );

  const onPageSizeChange = useCallback(
    (newSize) => {
      if (newSize === 10) {
        updateUrlParams({ pageSize: "", page: "" });
      } else {
        updateUrlParams({ pageSize: newSize, page: "" });
      }
    },
    [updateUrlParams]
  );

  const onSortChange = useCallback(
    (column) => {
      const nextDirection =
        column === sortColumn && sortDirection === "asc" ? "desc" : "asc";
      updateUrlParams({ sort: `${column}:${nextDirection}`, page: "" });
    },
    [updateUrlParams, sortColumn, sortDirection]
  );

  const onFilterChange = useCallback(
    (newFilters) => {
      updateUrlParams({
        ...newFilters,
        page: "",
      });
    },
    [updateUrlParams]
  );

  // Hàm lấy query params, thường dùng để gọi API (Server Component có thể dùng trực tiếp searchParams)
  const getQueryParams = useCallback(() => {
    return {
      page,
      pageSize,
      sortBy: sortColumn,
      sortOrder: sortDirection,
      ...filters, // Filters đã có đầy đủ tham số
    };
  }, [page, pageSize, sortColumn, sortDirection, filters]);

  // =========================================================
  // 4. Trả về API
  // =========================================================

  return {
    // READ (State)
    currentPage: page,
    pageSize,
    sortConfig: { column: sortColumn, direction: sortDirection },
    filters, 
    getQueryParams,

    // WRITE (Handlers)
    updateUrlParams,
    onPageChange,
    onPageSizeChange,
    onSortChange,
    onFilterChange,
  };
}
