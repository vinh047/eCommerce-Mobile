// import { useState, useMemo, useCallback } from "react";

// export default function usePagination(data = [], initialPageSize = 10) {
//   const [pageSize, setPageSize] = useState(initialPageSize);
//   const [currentPage, setCurrentPage] = useState(1);

//   const totalItems = data.length;
//   const totalPages = Math.ceil(totalItems / pageSize) || 1;

//   const paginatedData = useMemo(() => {
//     const start = (currentPage - 1) * pageSize;
//     return data.slice(start, start + pageSize);
//   }, [data, currentPage, pageSize]);

//   const changePage = useCallback((page) => setCurrentPage(page), []);
//   const changePageSize = useCallback((size) => {
//     setPageSize(size);
//     setCurrentPage(1);
//   }, []);

//   return {
//     paginatedData,
//     pageSize,
//     currentPage,
//     totalPages,
//     totalItems,
//     setPageSize,
//     setCurrentPage,
//     changePage,
//     changePageSize,
//   };
// }
