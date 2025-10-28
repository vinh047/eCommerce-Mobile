"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import usersApi from "@/lib/api/usersApi";
import { useTableState } from "@/hooks/useTableState"; 
import { useUserMutations } from "./useUserMutations";
import { useSelection } from "@/hooks/useSelection";

export function useFetchUsers(initialUsers = {}) {
  // =========================================================
  // 1. INITIAL STATE & COMPOSITION (Kết hợp các hook tái sử dụng)
  // =========================================================

  const userInitialState = {};
  const tableState = useTableState(userInitialState);

  const {
    selectedItems,
    deselectAll,
    selectItem,
    selectAllForFilter,
    selectPage,
    selectAll,
  } = useSelection({ api: usersApi });

  // =========================================================
  // 2. STATE CỤ THỂ (READ State)
  // =========================================================

  const [users, setUsers] = useState(initialUsers.data || []);
  const [totalItems, setTotalItems] = useState(
    initialUsers.pagination?.totalItems || 0
  );
  const [isLoading, setIsLoading] = useState(false);

  // =========================================================
  // 3. LOGIC FETCHING (READ Function)
  // =========================================================

  const fetchUsers = useCallback(
    async (params) => {
      setIsLoading(true);
      try {
        // Lấy params mới nhất từ tableState (được đọc từ URL)
        const apiParams = params || tableState.getQueryParams();

        const res = await usersApi.getUsers(apiParams);

        setUsers(res.data);
        setTotalItems(res.pagination?.totalItems ?? res.data.length);

        // Luôn reset selection khi dữ liệu (trang/bộ lọc) thay đổi
        deselectAll();
      } catch (err) {
        console.error("Fetch users failed:", err);
        toast.error("Không thể tải danh sách người dùng.");
      } finally {
        setIsLoading(false); // Kết thúc loading
      }
    },
    [deselectAll, tableState]
  );

  // =========================================================
  // 4. EFFECT FETCH (Side Effect)
  // =========================================================

  // Effect 1: Đồng bộ dữ liệu khởi tạo (nếu có, ví dụ từ SSR)
  useEffect(() => {
    setUsers(initialUsers.data || []);
    setTotalItems(initialUsers.pagination?.totalItems || 0);
  }, [initialUsers]);

  // =========================================================
  // 5. COMPOSITION: Kết hợp Mutators (WRITE Functions)
  // =========================================================

  const { isMutating, deleteUser, saveUser, handleBulkAction } =
    useUserMutations(fetchUsers, selectedItems, deselectAll);

  // =========================================================
  // 6. EXPORT API
  // =========================================================

  return {
    // Data (READ)
    users,
    totalItems,
    isLoading, // Trạng thái Loading

    // Table State & Handlers (SORT/FILTER/PAGINATION/URL)
    ...tableState,

    // Selection State & Handlers
    selectedItems,
    selectItem,
    selectPage,
    selectAll,
    deselectAll,
    selectAllForFilter,

    // CRUD Handlers (WRITE)
    fetchUsers,
    deleteUser,
    saveUser,
    handleBulkAction,
  };
}
