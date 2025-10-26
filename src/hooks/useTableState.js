import { useCallback, useState } from "react";
import { usePaginationQuery } from "./usePaginationQuery";

export function useTableState(initialState = {}) {
  const {
    currentPage,
    setCurrentPage,
    pageSize,
    onPageChange,
    onPageSizeChange,
  } = usePaginationQuery(initialState.pageSize, initialState.page);

  const defaultFilters = { search: "", ...initialState.filters };
  const [filters, setFilters] = useState(defaultFilters);

  const [sortConfig, setSortConfig] = useState(
    initialState.sortConfig || { column: "id", direction: "asc" }
  );

  const handleSortChange = useCallback(
    (column) => {
      setSortConfig((prev) => {
        const newSort = {
          column,
          direction:
            prev.column === column && prev.direction === "asc" ? "desc" : "asc",
        };
        setCurrentPage(1);
        return newSort;
      });
    },
    [setCurrentPage]
  );

  const handleFilterChange = useCallback(
    (newFilters) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      setCurrentPage(1);
    },
    [setCurrentPage]
  );

  const getQueryParams = useCallback(() => {
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (Array.isArray(value) && value.length === 0) return acc;
      acc[key] = Array.isArray(value) ? value.join(",") : value;
      return acc;
    }, {});

    return {
      page: currentPage,
      pageSize: pageSize,
      sortBy: sortConfig.column,
      sortOrder: sortConfig.direction,
      ...cleanFilters,
    };
  }, [currentPage, pageSize, filters, sortConfig]);

  return {
    filters,
    sortConfig,
    currentPage,
    pageSize,
    onSortChange: handleSortChange,
    onFilterChange: handleFilterChange,
    onPageChange,
    onPageSizeChange,
    getQueryParams,
    setCurrentPage,
    setFilters,
    setSortConfig, 
  };
}
