"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import inventoryApi from "@/lib/api/inventoryApi";
import { useInventoryMutations } from "./useInventoryMutations";

export function useFetchInventory(initialTransactions = {}) {
  const [transactions, setTransactions] = useState(initialTransactions.data || []);
  const [totalItems, setTotalItems] = useState(
    initialTransactions.pagination?.totalItems || 0
  );
  const [isLoading, setIsLoading] = useState(false);

  // Hàm gọi API lấy danh sách
  const fetchTransactions = useCallback(async (params) => {
    setIsLoading(true);
    try {
      const res = await inventoryApi.getTransactions(params);
      setTransactions(res.data);
      setTotalItems(res.pagination?.totalItems ?? res.data.length);
    } catch (err) {
      console.error("Fetch inventory failed:", err);
      toast.error("Không thể tải lịch sử kho.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync với dữ liệu từ Server khi mới vào trang
  useEffect(() => {
    setTransactions(initialTransactions.data || []);
    setTotalItems(initialTransactions.pagination?.totalItems || 0);
  }, [initialTransactions]);

  // Import logic ghi (Create/Update)
  const { createTransaction } = useInventoryMutations(fetchTransactions);

  return {
    transactions,
    totalItems,
    isLoading,
    fetchTransactions,
    createTransaction, // Expose hàm tạo để Client dùng
  };
}