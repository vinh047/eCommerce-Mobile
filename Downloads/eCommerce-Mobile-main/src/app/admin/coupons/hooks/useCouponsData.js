"use client";
import { useState, useCallback, useEffect } from "react";
import couponsApi from "@/lib/api/couponsApi";
import { toast } from "sonner";
import { usePaginationQuery } from "@/hooks/usePaginationQuery";

export function useCouponsData() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [filters, setFilters] = useState({ search: "", status: "", type: "" });
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
  } = usePaginationQuery(10);

  // Fetch coupons
  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await couponsApi.getCoupons({
        page: currentPage,
        pageSize,
        search: filters.search || "",
        status: filters.status || "",
        type: filters.type || "",
        sortBy: sortConfig.column,
        sortOrder: sortConfig.direction,
      });
      setCoupons(res.data);
      setTotalItems(res.pagination.totalItems);
    } catch (err) {
      console.error("Fetch coupons failed:", err);
      toast.error("Không thể tải danh sách mã giảm giá.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filters, sortConfig]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

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
      const res = await couponsApi.getAllIds(filters); // ⭐ Gọi API lấy tất cả IDs của coupons
      setSelectedItems(new Set(res.ids));
    } catch {
      toast.error("Không thể chọn tất cả mã giảm giá.");
    }
  }, [filters]);

  const deselectAll = useCallback(() => setSelectedItems(new Set()), []);

  // Delete coupon
  const deleteCoupon = useCallback(
    // ⭐ Hàm xóa coupon
    async (id) => {
      if (!confirm("Bạn có chắc muốn xóa mã giảm giá này?")) return;
      setLoading(true);
      try {
        await couponsApi.deleteCoupon(id);
        toast.success("Đã xóa mã giảm giá thành công.");
        fetchCoupons();
      } catch {
        toast.error("Xóa thất bại.");
      } finally {
        setLoading(false);
      }
    },
    [fetchCoupons]
  );

  // Save coupon
  const saveCoupon = useCallback(
    async (data, mode, selectedCoupon) => {
      try {
        if (mode === "create") {
          await couponsApi.createCoupon(data);
          toast.success("Tạo mã giảm giá thành công");
        } else {
          await couponsApi.updateCoupon(selectedCoupon.id, data);
          toast.success("Cập nhật mã giảm giá thành công");
        }
        fetchCoupons();
      } catch (err) {
        console.error(err);
        toast.error("Lưu thất bại");
      }
    },
    [fetchCoupons]
  );

  // Bulk Action
  const handleBulkAction = useCallback(
    async (action) => {
      if (selectedItems.size === 0)
        return toast.warning("Chưa chọn mã giảm giá nào.");

      if (
        action === "delete" &&
        !confirm(`Bạn có chắc muốn xóa ${selectedItems.size} mã giảm giá?`)
      )
        return;

      try {
        await couponsApi.bulkAction(Array.from(selectedItems), action);
        toast.success(`Đã ${action} ${selectedItems.size} mã giảm giá.`);
        setSelectedItems(new Set());
        fetchCoupons();
      } catch (err) {
        console.error(err);
        toast.error("Thao tác thất bại.");
      }
    },
    [selectedItems, fetchCoupons]
  );

  return {
    coupons,
    loading,
    totalItems,
    filters,
    sortConfig,
    currentPage,
    pageSize,
    selectedItems,
    setFilters,
    fetchCoupons,
    updateSort,
    selectItem,
    selectAll,
    deselectAll,
    deleteCoupon,
    saveCoupon,
    handleBulkAction,
    onPageChange,
    onPageSizeChange,
  };
}
