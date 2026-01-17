"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import staffApi from "@/lib/api/staffApi";
import { useStaffMutations } from "./useStaffMutations";
import { useSelection } from "@/hooks/useSelection";

export function useFetchStaff(initialData = {}) {
  const { selectedItems, deselectAll, selectItem, selectAll } = useSelection({
    api: staffApi,
  });

  const [staffs, setStaffs] = useState(initialData.data || []);
  const [totalItems, setTotalItems] = useState(
    initialData.pagination?.totalItems || 0
  );
  const [isLoading, setIsLoading] = useState(false);

  const fetchStaffs = useCallback(
    async (params) => {
      setIsLoading(true);
      try {
        const res = await staffApi.getStaffs(params);
        setStaffs(res.data);
        setTotalItems(res.pagination?.totalItems || 0);
        deselectAll();
      } catch (err) {
        console.error("Fetch staff failed:", err);
        toast.error("Không thể tải danh sách nhân viên.");
      } finally {
        setIsLoading(false);
      }
    },
    [deselectAll]
  );

  useEffect(() => {
    setStaffs(initialData.data || []);
    setTotalItems(initialData.pagination?.totalItems || 0);
  }, [initialData]);

  const { isMutating, deleteStaff, saveStaff, handleBulkAction } =
    useStaffMutations(fetchStaffs, selectedItems, deselectAll);

  return {
    staffs,
    totalItems,
    isLoading,
    selectedItems,
    selectItem,
    selectAll,
    deselectAll,
    deleteStaff,
    saveStaff,
    handleBulkAction,
    isMutating,
  };
}