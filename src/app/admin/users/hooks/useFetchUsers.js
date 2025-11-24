"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import usersApi from "@/lib/api/usersApi";
import { useUserMutations } from "./useUserMutations";
import { useSelection } from "@/hooks/useSelection";

export function useFetchUsers(initialUsers = {}) {
  const { selectedItems, deselectAll, selectItem, selectAll } = useSelection({
    api: usersApi,
  });

  const [users, setUsers] = useState(initialUsers.data || []);
  const [totalItems, setTotalItems] = useState(
    initialUsers.pagination?.totalItems || 0
  );
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = useCallback(
    async (params) => {
      setIsLoading(true);
      try {
        const apiParams = params;
        console.log(apiParams);
        const res = await usersApi.getUsers(apiParams);

        setUsers(res.data);
        setTotalItems(res.pagination?.totalItems ?? res.data.length);

        deselectAll();
      } catch (err) {
        console.error("Fetch users failed:", err);
        toast.error("Không thể tải danh sách người dùng.");
      } finally {
        setIsLoading(false);
      }
    },
    [deselectAll]
  );

  useEffect(() => {
    setUsers(initialUsers.data || []);
    setTotalItems(initialUsers.pagination?.totalItems || 0);
  }, [initialUsers]);

  const { isMutating, deleteUser, saveUser, handleBulkAction } =
    useUserMutations(fetchUsers, selectedItems, deselectAll);

  return {
    // Data (READ)
    users,
    totalItems,
    isLoading,

    // Selection State & Handlers
    selectedItems,
    selectItem,
    selectAll,
    deselectAll,

    // CRUD Handlers (WRITE)
    deleteUser,
    saveUser,
    handleBulkAction,
  };
}
