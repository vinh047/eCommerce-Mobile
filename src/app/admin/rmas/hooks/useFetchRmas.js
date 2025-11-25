"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import rmasApi from "@/lib/api/rmasApi";
import { useRmaMutations } from "./useRmaMutations";
import { useSelection } from "@/hooks/useSelection";

export function useFetchRmas(initialData = {}) {
  const { selectedItems, deselectAll, selectItem, selectAll } = useSelection({
    api: rmasApi,
  });

  const [rmas, setRmas] = useState(initialData.data || []);
  const [totalItems, setTotalItems] = useState(
    initialData.pagination?.totalItems || 0
  );
  const [isLoading, setIsLoading] = useState(false);

  const fetchRmas = useCallback(
    async (params) => {
      setIsLoading(true);
      try {
        const res = await rmasApi.getRmas(params);
        setRmas(res.data);
        setTotalItems(res.pagination?.totalItems || 0);
        deselectAll();
      } catch (err) {
        console.error(err);
        toast.error("Lỗi tải danh sách RMA.");
      } finally {
        setIsLoading(false);
      }
    },
    [deselectAll]
  );

  useEffect(() => {
    setRmas(initialData.data || []);
    setTotalItems(initialData.pagination?.totalItems || 0);
  }, [initialData]);

  const { isMutating, deleteRma, saveRma, handleBulkAction } =
    useRmaMutations(fetchRmas, selectedItems, deselectAll);

  return {
    rmas,
    totalItems,
    isLoading,
    selectedItems,
    selectItem,
    selectAll,
    deselectAll,
    deleteRma,
    saveRma,
    handleBulkAction,
    isMutating,
  };
}