"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import cartsApi from "@/lib/api/cartsApi";
import { useCartMutations } from "./useCartMutations";
import { useSelection } from "@/hooks/useSelection";

export function useFetchCarts(initialData = {}) {
  const { selectedItems, deselectAll, selectItem, selectAll } = useSelection({
    api: cartsApi,
  });

  const [carts, setCarts] = useState(initialData.data || []);
  const [totalItems, setTotalItems] = useState(
    initialData.pagination?.totalItems || 0
  );
  const [isLoading, setIsLoading] = useState(false);

  const fetchCarts = useCallback(
    async (params) => {
      setIsLoading(true);
      try {
        // Gọi API fetch mới với params (search, sort, page...)
        const res = await cartsApi.getCarts(params);

        setCarts(res.data);
        setTotalItems(res.pagination?.totalItems ?? res.data.length);

        // Reset selection khi chuyển trang hoặc filter
        deselectAll();
      } catch (err) {
        console.error("Fetch carts failed:", err);
        toast.error("Không thể tải danh sách giỏ hàng.");
      } finally {
        setIsLoading(false);
      }
    },
    [deselectAll]
  );

  // Cập nhật state nếu initialData thay đổi (ví dụ server re-render)
  useEffect(() => {
    setCarts(initialData.data || []);
    setTotalItems(initialData.pagination?.totalItems || 0);
  }, [initialData]);

  const { isMutating, deleteCart, handleBulkAction } =
    useCartMutations(fetchCarts, selectedItems, deselectAll);

  return {
    // Data (READ)
    carts,
    totalItems,
    isLoading,

    // Selection State & Handlers
    selectedItems,
    selectItem,
    selectAll,
    deselectAll,

    // CRUD Handlers (WRITE)
    deleteCart,
    handleBulkAction,
  };
}