"use client";

import { useState, useCallback, useEffect, use } from "react";
import { toast } from "sonner";
import variantsApi from "@/lib/api/variantsApi";
import { useVariantMutations } from "./useVariantMutations";
import { useSelection } from "@/hooks/useSelection";
import { useSearchParams } from "next/navigation";

export function useFetchVariants(initialVariants = {}) {
  const { selectedItems, deselectAll, selectItem, selectAll } = useSelection({
    api: variantsApi,
  });
  const searchParams = useSearchParams();
  const [variants, setVariants] = useState(initialVariants.data || []);
  const [totalItems, setTotalItems] = useState(
    initialVariants.pagination?.totalItems || 0
  );
  const [isLoading, setIsLoading] = useState(false);

  const fetchVariants = useCallback(
    async (params) => {
      setIsLoading(true);
      try {
        const res = await variantsApi.getVariants(
          params || searchParams.toString() || ""
        );
        setVariants(res.data);
        setTotalItems(res.pagination?.totalItems ?? res.data.length);
        deselectAll();
      } catch (err) {
        console.error("Fetch variants failed:", err);
        toast.error("Không thể tải danh sách biến thể.");
      } finally {
        setIsLoading(false);
      }
    },
    [deselectAll, searchParams]
  );

  useEffect(() => {
    setVariants(initialVariants.data || []);
    setTotalItems(initialVariants.pagination?.totalItems || 0);
  }, [initialVariants]);

  const { isMutating, deleteVariant, saveVariant, handleBulkAction } =
    useVariantMutations(fetchVariants, selectedItems, deselectAll);

  return {
    variants,
    totalItems,
    isLoading,
    selectedItems,
    selectItem,
    selectAll,
    deselectAll,
    deleteVariant,
    saveVariant,
    handleBulkAction,
  };
}
