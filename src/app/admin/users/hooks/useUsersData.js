"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import usersApi from "@/lib/api/usersApi";
import { toast } from "sonner";
import { usePaginationQuery } from "@/hooks/usePaginationQuery";
import debounce from "lodash.debounce";

export function useUsersData(
  initialUsers = [],
) {
  const [users, setUsers] = useState(initialUsers.data || []);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(initialUsers.pagination?.totalItems || 0);
  const [filters, setFilters] = useState(
    initialUsers.filters || { search: "", status: [] }
  );
  const [sortConfig, setSortConfig] = useState(
    initialUsers.sortConfig || { column: "id", direction: "asc" }
  );

  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectAllForFilter, setSelectAllForFilter] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const didMount = useRef(false);
  const skipNextEffect = useRef(false);

  const {
    currentPage,
    setCurrentPage,
    pageSize,
    onPageChange,
    onPageSizeChange,
  } = usePaginationQuery(initialUsers.pageSize, initialUsers.page);

  // ===== Debounced fetch =====
  const fetchUsers = useCallback(
    async (overrides = {}) => {
      setLoading(true);
      try {
        const apiParams = {
          page: overrides.page ?? currentPage,
          pageSize: overrides.pageSize ?? pageSize,
          search: overrides.filters?.search ? filters?.search || "" : "",
          status:
            overrides.filters?.status ??
            (filters?.status.length > 0 ? filters?.status : ""),
          sortBy: overrides.sortConfig?.column ?? sortConfig.column,
          sortOrder: overrides.sortConfig?.direction ?? sortConfig.direction,
        };

        const res = await usersApi.getUsers(apiParams);
        setUsers(res.data);
        setTotalItems(res.pagination?.totalItems ?? res.data.length);

        // Reset selection when filters/page change
        if (overrides.filters || overrides.page) {
          setSelectedItems(new Set());
          setSelectAllForFilter(false);
        }
      } catch (err) {
        console.error("Fetch users failed:", err);
        toast.error("Không thể tải danh sách người dùng.");
      } finally {
        const t = setTimeout(() => setLoading(false), 10);
        return () => clearTimeout(t);
        // setLoading(false);
      }
    },
    [currentPage, pageSize, filters, sortConfig]
  );

  const debouncedFetch = useRef(debounce(fetchUsers, 300)).current;

  // ===== Update URL =====
  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", String(currentPage));
    if (pageSize !== 10) params.set("pageSize", String(pageSize));
    if (filters.search) params.set("search", filters.search.trim());
    if (filters.status.length > 0)
      params.set("status", filters.status.join(","));
    if (sortConfig)
      params.set("sort", `${sortConfig.column}:${sortConfig.direction}`);
    skipNextEffect.current = true;
    console.log("Updating URL with params:", params.toString());
    router.replace(`${pathname}?${params.toString()}`);
  }, [currentPage, pageSize, filters, sortConfig, pathname, router]);

  // ===== Effect chạy khi filter/sort/page change =====
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true; // Skip lần render đầu
      return;
    }
    if (skipNextEffect.current) {
      skipNextEffect.current = false;
      return;
    }
    updateUrlParams();
    debouncedFetch();
  }, [
    currentPage,
    pageSize,
    filters,
    sortConfig,
    debouncedFetch,
    updateUrlParams,
  ]);

  // ===== Handlers =====
  const updateSort = useCallback(
    (column) => {
      setSortConfig((prev) => {
        const newSort = {
          column,
          direction:
            prev.column === column && prev.direction === "asc" ? "desc" : "asc",
        };
        setCurrentPage(1);
        fetchUsers({ page: 1, sortConfig: newSort });
        return newSort;
      });
    },
    [setCurrentPage, fetchUsers]
  );

  const customSetFilters = useCallback(
    (newFilters) => {
      setFilters(newFilters);
      setCurrentPage(1);
      fetchUsers({ filters: newFilters, page: 1 });
    },
    [fetchUsers, setCurrentPage]
  );

  const selectItem = useCallback((id, selected) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      selected ? newSet.add(id) : newSet.delete(id);
      return newSet;
    });
  }, []);

  const selectAll = useCallback(async () => {
    try {
      const apiParams = {
        search: filters.search || "",
        status: filters.status.length > 0 ? filters.status : "",
      };
      const res = await usersApi.getAllIds(apiParams);
      setSelectedItems(new Set(res.ids));
      setSelectAllForFilter(true);
    } catch {
      toast.error("Không thể chọn tất cả người dùng.");
    }
  }, [filters]);

  const deselectAll = useCallback(() => {
    setSelectedItems(new Set());
    setSelectAllForFilter(false);
  }, []);

  const deleteUser = useCallback(
    async (id) => {
      if (!confirm("Bạn có chắc muốn xóa người dùng này?")) return;
      setLoading(true);
      try {
        await usersApi.deleteUser(id);
        toast.success("Đã xóa người dùng thành công.");
        fetchUsers();
      } catch {
        toast.error("Xóa thất bại.");
      } finally {
        setLoading(false);
      }
    },
    [fetchUsers]
  );

  const saveUser = useCallback(
    async (data, mode, selectedUser) => {
      try {
        if (mode === "create") {
          await usersApi.createUser(data);
          toast.success("Tạo người dùng thành công");
        } else {
          await usersApi.updateUser(selectedUser.id, data);
          toast.success("Cập nhật người dùng thành công");
        }
        fetchUsers();
      } catch (err) {
        console.error(err);
        toast.error("Lưu thất bại");
      }
    },
    [fetchUsers]
  );

  const handleBulkAction = useCallback(
    async (action) => {
      if (selectedItems.size === 0)
        return toast.warning("Chưa chọn người dùng nào.");
      if (
        action === "delete" &&
        !confirm(`Bạn có chắc muốn xóa ${selectedItems.size} người dùng?`)
      )
        return;
      try {
        await usersApi.bulkAction(Array.from(selectedItems), action);
        toast.success(`Đã ${action} ${selectedItems.size} người dùng.`);
        deselectAll();
        fetchUsers();
      } catch (err) {
        console.error(err);
        toast.error("Thao tác thất bại.");
      }
    },
    [selectedItems, fetchUsers, deselectAll]
  );

  return {
    users,
    loading,
    totalItems,
    filters,
    sortConfig,
    currentPage,
    pageSize,
    selectedItems,
    selectAllForFilter,
    setFilters: customSetFilters,
    fetchUsers,
    updateSort,
    selectItem,
    selectAll,
    deselectAll,
    deleteUser,
    saveUser,
    handleBulkAction,
    onPageChange,
    onPageSizeChange,
  };
}
