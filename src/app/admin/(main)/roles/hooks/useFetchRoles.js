"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import rolesApi from "@/lib/api/rolesApi";
import { useRoleMutations } from "./useRoleMutations";
import { useSelection } from "@/hooks/useSelection";

export function useFetchRoles(initialRoles = {}) {
  // Selection hook (nếu bạn muốn chọn nhiều role để xóa)
  const { selectedItems, deselectAll, selectItem, selectAll } = useSelection({
    api: rolesApi,
  });

  const [roles, setRoles] = useState(initialRoles.data || []);
  // Role thường ít nên có thể không cần pagination phức tạp, 
  // nhưng giữ structure này để dễ mở rộng
  const [totalItems, setTotalItems] = useState(
    initialRoles.pagination?.totalItems || 0
  );
  const [isLoading, setIsLoading] = useState(false);

  const fetchRoles = useCallback(
    async (params) => {
      setIsLoading(true);
      try {
        const res = await rolesApi.getRoles(params);
        setRoles(res.data);
        setTotalItems(res.pagination?.totalItems ?? res.data.length);
        deselectAll();
      } catch (err) {
        console.error("Fetch roles failed:", err);
        toast.error("Không thể tải danh sách vai trò.");
      } finally {
        setIsLoading(false);
      }
    },
    [deselectAll]
  );

  // Sync initial data
  useEffect(() => {
    if (initialRoles.data) {
        setRoles(initialRoles.data);
        setTotalItems(initialRoles.pagination?.totalItems || 0);
    }
  }, [initialRoles]);

  // Kết nối Mutation
  const { isMutating, deleteRole, saveRole, handleBulkAction } =
    useRoleMutations(fetchRoles, selectedItems, deselectAll);

  return {
    roles,
    totalItems,
    isLoading,
    selectedItems,
    selectItem,
    selectAll,
    deselectAll,
    deleteRole,
    saveRole,
    handleBulkAction,
    isMutating
  };
}