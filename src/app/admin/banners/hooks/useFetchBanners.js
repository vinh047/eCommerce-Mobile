"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useBannerMutations } from "./useBannerMutations";
import { useSelection } from "@/hooks/useSelection";
import bannersApi from "@/lib/api/bannerApi";

export function useFetchBanners(initialData = {}) {
  const { selectedItems, deselectAll, selectItem, selectAll } = useSelection({
    api: bannersApi,
  });

  const [banners, setBanners] = useState(initialData.data || []);
  const [totalItems, setTotalItems] = useState(
    initialData.pagination?.totalItems || 0
  );
  const [isLoading, setIsLoading] = useState(false);

  const fetchBanners = useCallback(
    async (params) => {
      setIsLoading(true);
      try {
        const res = await bannersApi.getBanners(params);
        setBanners(res.data);
        setTotalItems(res.pagination?.totalItems || 0);
        deselectAll();
      } catch (err) {
        console.error("Fetch banners failed:", err);
        toast.error("Không thể tải danh sách banner.");
      } finally {
        setIsLoading(false);
      }
    },
    [deselectAll]
  );

  useEffect(() => {
    setBanners(initialData.data || []);
    setTotalItems(initialData.pagination?.totalItems || 0);
  }, [initialData]);

  const { isMutating, deleteBanner, saveBanner, handleBulkAction } =
    useBannerMutations(fetchBanners, selectedItems, deselectAll);

  return {
    banners,
    totalItems,
    isLoading,
    selectedItems,
    selectItem,
    selectAll,
    deselectAll,
    deleteBanner,
    saveBanner,
    handleBulkAction,
    isMutating,
  };
}