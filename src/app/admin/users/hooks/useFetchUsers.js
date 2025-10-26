// hooks/useFetchUsers.js (Phiên bản Hoàn Chỉnh)
"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import usersApi from "@/lib/api/usersApi"; // Giả định đã import usersApi
import { useTableState } from "@/hooks/useTableState";
import { useUserMutations } from "./useUserMutations";
import { useSelection } from "@/hooks/useSelection";
import { useUrlSync } from "@/hooks/useUrlSync";



export function useFetchUsers(initialUsers = {}) {
  const didMount = useRef(false);

  // =========================================================
  // 1. INITIAL STATE & COMPOSITION (Kết hợp các hook tái sử dụng)
  // =========================================================

  // Định nghĩa trạng thái khởi tạo chi tiết cho Users
  const userInitialState = {
    page: initialUsers.page,
    pageSize: initialUsers.pageSize,
    filters: {
      search: initialUsers.filters?.search || "",
      status: initialUsers.filters?.status || [],
    },
    sortConfig: initialUsers.sortConfig,
  };

  const tableState = useTableState(userInitialState);
  const { skipNextEffect } = useUrlSync(tableState);

  const {
    selectedItems,
    deselectAll,
    selectItem,
    selectAllForFilter,
    selectPage, 
  } = useSelection();

  // =========================================================
  // 2. STATE CỤ THỂ (READ State)
  // =========================================================

  const [users, setUsers] = useState(initialUsers.data || []);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(
    initialUsers.pagination?.totalItems || 0
  );

  // =========================================================
  // 3. LOGIC FETCHING (READ Function)
  // =========================================================

  const fetchUsers = useCallback(
    async (params) => {
      setLoading(true);
      try {
        // Lấy params từ tableState hoặc từ overrides nếu được truyền vào
        const apiParams = params || tableState.getQueryParams();

        const res = await usersApi.getUsers(apiParams); // Gọi API

        setUsers(res.data);
        setTotalItems(res.pagination?.totalItems ?? res.data.length);

        // Luôn reset selection khi dữ liệu (trang/bộ lọc) thay đổi
        deselectAll();
      } catch (err) {
        console.error("Fetch users failed:", err);
        toast.error("Không thể tải danh sách người dùng.");
      } finally {
        setLoading(false);
      }
    },
    [deselectAll, tableState]
  ); // Phụ thuộc vào tableState để đảm bảo fetchUsers mới nhất

  // =========================================================
  // 4. EFFECT FETCH (Side Effect)
  // =========================================================


  // =========================================================
  // 5. COMPOSITION: Kết hợp Mutators (WRITE Functions)
  // =========================================================

  const { isMutating, deleteUser, saveUser, handleBulkAction } =
    useUserMutations(
      fetchUsers, // Hàm callback để refresh dữ liệu sau mutation thành công
      selectedItems, // State cần thiết cho Bulk Action
      deselectAll // Handler cần thiết cho Bulk Action
    );

  // =========================================================
  // 6. EXPORT API
  // =========================================================

  return {
    // Data (READ)
    users,
    // Loading tổng hợp: Đang tải dữ liệu, hoặc đang có mutation (CRUD)
    loading: loading || isMutating,
    totalItems,

    // Table State & Handlers (SORT/FILTER/PAGINATION/URL)
    ...tableState,

    // Selection State & Handlers
    selectedItems,
    selectItem,
    selectPage, // Chọn trang hiện tại
    selectAllForFilter,

    // CRUD Handlers (WRITE)
    fetchUsers, // Vẫn export để có thể gọi fetch thủ công (ví dụ: nút Refresh)
    deleteUser,
    saveUser,
    handleBulkAction,
  };
}
