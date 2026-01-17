"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import ordersApi from "@/lib/api/ordersApi";
import { useOrderMutations } from "./useOrderMutations";
import { useSelection } from "@/hooks/useSelection";

export function useFetchOrders(initialData = {}) {
  const { selectedItems, deselectAll, selectItem, selectAll } = useSelection({
    api: ordersApi,
  });

  const [orders, setOrders] = useState(initialData.data || []);
  const [totalItems, setTotalItems] = useState(
    initialData.pagination?.totalItems || 0
  );
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = useCallback(
    async (params) => {
      setIsLoading(true);
      try {
        const res = await ordersApi.getOrders(params);
        setOrders(res.data);
        setTotalItems(res.pagination?.totalItems || 0);
        deselectAll();
      } catch (err) {
        console.error("Fetch orders failed:", err);
        toast.error("Không thể tải danh sách đơn hàng.");
      } finally {
        setIsLoading(false);
      }
    },
    [deselectAll]
  );

  useEffect(() => {
    setOrders(initialData.data || []);
    setTotalItems(initialData.pagination?.totalItems || 0);
  }, [initialData]);

  const { isMutating, deleteOrder, saveOrder, handleBulkAction } =
    useOrderMutations(fetchOrders, selectedItems, deselectAll);

  return {
    orders,
    totalItems,
    isLoading,
    selectedItems,
    selectItem,
    selectAll,
    deselectAll,
    deleteOrder,
    saveOrder,
    handleBulkAction,
    isMutating,
  };
}