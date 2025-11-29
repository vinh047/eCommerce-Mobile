"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import specsApi from "@/lib/api/specsApi";
import { useSpecMutations } from "./useSpecMutations";
import { useSelection } from "@/hooks/useSelection";

export function useFetchSpecs(initialData = {}) {
  const { selectedItems, deselectAll, selectItem, selectAll } = useSelection({
    api: specsApi,
  });

  const [specs, setSpecs] = useState(initialData.data || []);
  const [totalItems, setTotalItems] = useState(
    initialData.pagination?.totalItems || 0
  );
  const [isLoading, setIsLoading] = useState(false);

  const fetchSpecs = useCallback(
    async (params) => {
      setIsLoading(true);
      try {
        const res = await specsApi.getSpecs(params);
        setSpecs(res.data);
        setTotalItems(res.pagination?.totalItems ?? res.data.length);
        deselectAll();
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải danh sách mẫu thông số.");
      } finally {
        setIsLoading(false);
      }
    },
    [deselectAll]
  );

  useEffect(() => {
    setSpecs(initialData.data || []);
    setTotalItems(initialData.pagination?.totalItems || 0);
  }, [initialData]);

  const mutations = useSpecMutations(fetchSpecs, selectedItems, deselectAll);

  return {
    specs,
    totalItems,
    isLoading,
    selectedItems,
    selectItem,
    selectAll,
    deselectAll,
    fetchSpecs,
    ...mutations,
  };
}
