"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import brandsApi from "@/lib/api/brandsApi";
import { useBrandMutations } from "./useBrandMutations";
import { useSelection } from "@/hooks/useSelection";

export function useFetchBrands(initialBrands = {}) {
  const { selectedItems, deselectAll, selectItem, selectAll } = useSelection({
    api: brandsApi,
  });

  const [brands, setBrands] = useState(initialBrands.data || []);
  const [totalItems, setTotalItems] = useState(
    initialBrands.pagination?.totalItems || 0
  );
  const [isLoading, setIsLoading] = useState(false);

  const fetchBrands = useCallback(
    async (params) => {
      setIsLoading(true);
      try {
        const apiParams = params;
        const res = await brandsApi.getBrands(apiParams);

        setBrands(res.data);
        setTotalItems(res.pagination?.totalItems ?? res.data.length);

        deselectAll();
      } catch (err) {
        console.error("Fetch brands failed:", err);
        toast.error("Không thể tải danh sách thương hiệu.");
      } finally {
        setIsLoading(false);
      }
    },
    [deselectAll]
  );

  useEffect(() => {
    setBrands(initialBrands.data || []);
    setTotalItems(initialBrands.pagination?.totalItems || 0);
  }, [initialBrands]);

  const { isMutating, deleteBrand, saveBrand, handleBulkAction } =
    useBrandMutations(fetchBrands, selectedItems, deselectAll);

  return {
    brands,
    totalItems,
    isLoading,

    selectedItems,
    selectItem,
    selectAll,
    deselectAll,

    deleteBrand,
    saveBrand,
    handleBulkAction,
  };
}
