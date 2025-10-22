"use client";
import { useState, useCallback, useEffect } from "react";
import usersApi from "@/lib/api/usersApi";
import { toast } from "sonner";
import { usePaginationQuery } from "@/hooks/usePaginationQuery";

export function useUsersData() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [filters, setFilters] = useState({ search: "", status: "" });
  const [sortConfig, setSortConfig] = useState({
    column: "createdAt",
    direction: "desc",
  });

  const {
    currentPage,
    setCurrentPage,
    pageSize,
    onPageChange,
    onPageSizeChange,
  } = usePaginationQuery(10);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await usersApi.getUsers({
        page: currentPage,
        pageSize,
        search: filters.search || "",
        status: filters.status || "",
        sortBy: sortConfig.column,
        sortOrder: sortConfig.direction,
      });
      setUsers(res.data);
      setTotalItems(res.pagination.totalItems);
    } catch (err) {
      console.error("Fetch users failed:", err);
      toast.error("Không thể tải danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filters, sortConfig]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Sort
  const updateSort = useCallback((column) => {
    setSortConfig((prev) => ({
      column,
      direction:
        prev.column === column && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  // Select
  const selectItem = useCallback((id, selected) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      selected ? newSet.add(id) : newSet.delete(id);
      return newSet;
    });
  }, []);

  const selectAll = useCallback(async () => {
    try {
      const res = await usersApi.getAllIds(filters);
      setSelectedItems(new Set(res.ids));
    } catch {
      toast.error("Không thể chọn tất cả người dùng.");
    }
  }, [filters]);

  const deselectAll = useCallback(() => setSelectedItems(new Set()), []);

  // Delete user
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

  // Save user
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

  // Bulk Action
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
        setSelectedItems(new Set());
        fetchUsers();
      } catch (err) {
        console.error(err);
        toast.error("Thao tác thất bại.");
      }
    },
    [selectedItems, fetchUsers]
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
    setFilters,
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
