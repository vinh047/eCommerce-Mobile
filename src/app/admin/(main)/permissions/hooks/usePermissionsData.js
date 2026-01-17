"use client";
import { useState, useCallback, useEffect } from "react";
// Giả định bạn có API service cho Permission
import { toast } from "sonner";
import { usePaginationQuery } from "@/hooks/usePaginationQuery";
import permissionsApi from "@/lib/api/permissionsApi";

export function usePermissionsData() {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedItems, setSelectedItems] = useState(new Set());
  // Lọc theo search (Key hoặc Name)
  const [filters, setFilters] = useState({ search: "" });
  const [sortConfig, setSortConfig] = useState({
    column: "id",
    direction: "desc",
  });

  const {
    currentPage,
    setCurrentPage,
    pageSize,
    onPageChange,
    onPageSizeChange,
  } = usePaginationQuery(10); // Mặc định 10 items/page

  // Fetch permissions
  const fetchPermissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await permissionsApi.getPermissions({
        page: currentPage,
        pageSize,
        search: filters.search || "",
        sortBy: sortConfig.column,
        sortOrder: sortConfig.direction,
      });
      setPermissions(res.data);
      setTotalItems(res.pagination.totalItems);
    } catch (err) {
      console.error("Fetch permissions failed:", err);
      toast.error("Không thể tải danh sách quyền hạn.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filters, sortConfig]); // Tương tự useCouponsData

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  // Sort: Tương tự như useCouponsData
  const updateSort = useCallback((column) => {
    setSortConfig((prev) => ({
      column,
      direction:
        prev.column === column && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  // Select: Tương tự như useCouponsData
  const selectItem = useCallback((id, selected) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      selected ? newSet.add(id) : newSet.delete(id);
      return newSet;
    });
  }, []);

  const selectAll = useCallback(async () => {
    try {
      const res = await permissionsApi.getAllIds(filters); // ⭐ Gọi API lấy tất cả IDs
      setSelectedItems(new Set(res.ids));
    } catch {
      toast.error("Không thể chọn tất cả quyền hạn.");
    }
  }, [filters]);

  const deselectAll = useCallback(() => setSelectedItems(new Set()), []);

  // Delete permission
  const deletePermission = useCallback(
    async (id) => {
      if (!confirm("Bạn có chắc muốn xóa quyền hạn này?")) return;
      setLoading(true);
      try {
        await permissionsApi.deletePermission(id);
        toast.success("Đã xóa quyền hạn thành công.");
        fetchPermissions();
      } catch {
        toast.error("Xóa thất bại.");
      } finally {
        setLoading(false);
      }
    },
    [fetchPermissions]
  );

  // Save permission (Create/Update)
  const savePermission = useCallback(
    async (data, mode, selectedPermission) => {
      try {
        if (mode === "create") {
          await permissionsApi.createPermission(data);
          toast.success("Tạo quyền hạn thành công");
        } else {
          await permissionsApi.updatePermission(selectedPermission.id, data);
          toast.success("Cập nhật quyền hạn thành công");
        }
        fetchPermissions();
      } catch (err) {
        console.error(err);
        toast.error("Lưu thất bại");
      }
    },
    [fetchPermissions]
  );

  // Bulk Action
  const handleBulkAction = useCallback(
    async (action) => {
      if (selectedItems.size === 0)
        return toast.warning("Chưa chọn quyền hạn nào.");

      if (
        action === "delete" &&
        !confirm(`Bạn có chắc muốn xóa ${selectedItems.size} quyền hạn?`)
      )
        return;

      try {
        await permissionsApi.bulkAction(Array.from(selectedItems), action);
        toast.success(`Đã ${action} ${selectedItems.size} quyền hạn.`);
        setSelectedItems(new Set());
        fetchPermissions();
      } catch (err) {
        console.error(err);
        toast.error("Thao tác thất bại.");
      }
    },
    [selectedItems, fetchPermissions]
  );

  return {
    permissions,
    loading,
    totalItems,
    filters,
    sortConfig,
    currentPage,
    pageSize,
    selectedItems,
    setFilters,
    fetchPermissions,
    updateSort,
    selectItem,
    selectAll,
    deselectAll,
    deletePermission,
    savePermission,
    handleBulkAction,
    onPageChange,
    onPageSizeChange,
  };
}
