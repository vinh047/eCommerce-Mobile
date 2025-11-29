"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function usePaginationQuery(defaultPageSize = 10) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageParam = parseInt(searchParams.get("page") || "1");
  const sizeParam = parseInt(searchParams.get("pageSize") || defaultPageSize);

  const [currentPage, setCurrentPage] = useState(pageParam);
  const [pageSize, setPageSize] = useState(sizeParam);

  // Update URL mỗi khi thay đổi
  const updateQuery = (page, size) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    params.set("pageSize", size.toString());
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateQuery(page, pageSize);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
    updateQuery(1, size);
  };

  useEffect(() => {
    // khi reload thì sync lại với URL
    setCurrentPage(pageParam);
    setPageSize(sizeParam);
  }, [pageParam, sizeParam]);

  return {
    currentPage,
    setCurrentPage,
    pageSize,
    onPageChange: handlePageChange,
    onPageSizeChange: handlePageSizeChange,
  };
}
