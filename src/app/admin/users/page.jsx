"use client";

import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/Layout/AdminLayout";
import usersApi from "@/lib/api/usersApi";
import Userstable from "@/app/admin/users/_components/UsersTable";
import { useToast } from "@/hooks/useToast";
import usePagination from "@/hooks/usePagination";
import UsersTable from "@/app/admin/users/_components/UsersTable";
import UsersHeader from "@/app/admin/users/_components/UsersHeader";
import UsersToolbar from "@/app/admin/users/_components/UsersToolbar";
import UserBulkActionsBar from "@/app/admin/users/_components/BulkActionsBar";
import ToastContainer from "@/components/ui/ToastContainer";
import UserQuickViewModal from "@/app/admin/users/_components/QuickViewModal";
import UserModal from "@/app/admin/users/_components/UsersModal";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({
    column: "",
    direction: "asc",
  });

  const {
    paginatedData: currentUsers,
    pageSize,
    currentPage,
    totalPages,
    totalItems,
    setPageSize,
    setCurrentPage,
    changePage,
    changePageSize,
  } = usePagination(filteredUsers, 10);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await usersApi.getUsers();
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  // --- Filtering ---
  const applyFilters = useCallback(() => {
    let filtered = [...users];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.id.toString().toLowerCase().includes(searchLower)
      );
    }

    if (filters.status?.length) {
      filtered = filtered.filter((user) =>
        filters.status.some(
          (c) => user.status.toLowerCase() === c.toLowerCase()
        )
      );
    }

    // if (filters.status?.length) {
    //   filtered = filtered.filter(
    //     (user) =>
    //       filters.status.includes("active") ||
    //       filters.status.includes("blocked")
    //   );
    // }

    // if (filters.rating) {
    //   const minRating = parseFloat(filters.rating);
    //   filtered = filtered.filter((user) => user.rating >= minRating);
    // }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [users, filters, setCurrentPage]);

  const applySorting = useCallback(() => {
    if (!sortConfig.column) return;

    setFilteredUsers((prev) => {
      const sorted = [...prev].sort((a, b) => {
        const aVal = a[sortConfig.column];
        const bVal = b[sortConfig.column];

        if (typeof aVal === "string") {
          return sortConfig.direction === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        if (typeof aVal === "number") {
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        }

        return 0;
      });
      return sorted;
    });
  }, [sortConfig]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  useEffect(() => {
    applySorting();
  }, [applySorting]);

  // --- Actions ---
  const selectItem = useCallback((id, selected) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (selected) newSet.add(id);
      else newSet.delete(id);
      return newSet;
    });
  }, []);

  const selectAll = useCallback(() => {
    users.forEach((u) => setSelectedItems((prev) => new Set(prev).add(u.id)));
  }, [users]);

  const deselectAll = useCallback(() => setSelectedItems(new Set()), []);

  const updateFilters = useCallback((newFilters) => setFilters(newFilters), []);
  const updateSort = useCallback((col) => {
    setSortConfig((prev) => ({
      column: col,
      direction:
        prev.column === col && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const bulkAction = useCallback(async (action, ids) => {
    if (!ids.length) return;
    setLoading(true);

    try {
      await usersApi.bulkAction(ids, action);
      // Cập nhật lại danh sách
      const { data } = await usersApi.getUsers();
      setUsers(data);
      showToast(`Đã ${action} ${ids.length} người dùng`, "success");
    } catch (err) {
      console.error("Bulk action failed:", err);
      showToast("Có lỗi xảy ra khi xử lý người dùng", "error");
    } finally {
      setSelectedItems(new Set());
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id) => {
    setLoading(true);
    try {
      await usersApi.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      showToast("Đã xóa người dùng", "success");
    } catch (err) {
      console.error("Delete failed:", err);
      showToast("Xóa người dùng thất bại", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUsers = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setUsers([...sampleUsers]);
      setLoading(false);
    }, 1000);
  }, []);

  const { showToast } = useToast();

  const [showUserModal, setShowUserModal] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit'

  const handleCreateUser = () => {
    setModalMode("create");
    setSelectedUser(null);
    setShowUserModal(true);
  };

  const handleEditUser = (userId) => {
    const user = currentUsers.find((u) => u.id === userId);
    setModalMode("edit");
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleQuickView = (userId) => {
    const user = currentUsers.find((u) => u.id === userId);
    setSelectedUser(user);
    setShowQuickView(true);
  };

  const handleDeleteUser = (userId) => {
    if (confirm("Bạn có chắc muốn xóa người dùng này?")) {
      deleteUser(userId);
      showToast("Đã xóa người dùng thành công", "success");
    }
  };

  const handleBulkAction = (action) => {
    if (selectedItems.size === 0) {
      showToast("Vui lòng chọn ít nhất một người dùng", "warning");
      return;
    }

    switch (action) {
      case "active":
        bulkAction("active", Array.from(selectedItems));
        showToast(`Đã hiển thị ${selectedItems.size} người dùng`, "success");
        break;
      case "blocked":
        bulkAction("blocked", Array.from(selectedItems));
        showToast(`Đã ẩn ${selectedItems.size} người dùng`, "success");
        break;
      case "delete":
        if (confirm(`Bạn có chắc muốn xóa ${selectedItems.size} người dùng?`)) {
          bulkAction("delete", Array.from(selectedItems));
          showToast(`Đã xóa ${selectedItems.size} người dùng`, "success");
        }
        break;
      default:
        showToast("Tính năng đang được phát triển", "info");
    }
  };

  const handleExportCSV = () => {
    showToast("Đang xuất file CSV...", "info");
    setTimeout(() => {
      showToast("Đã xuất file CSV thành công", "success");
    }, 2000);
  };

  return (
    <AdminLayout>
      <div className="overflow-auto px-8 py-6 ">
        {/* Page Header */}
        <UsersHeader
          onCreateUser={handleCreateUser}
          onExportCSV={handleExportCSV}
        />

        {/* Toolbar */}
        <UsersToolbar
          filters={filters}
          onFiltersChange={updateFilters}
          onClearFilters={() => {
            updateFilters({});
            showToast("Đã xóa tất cả bộ lọc", "success");
          }}
        />

        {/* Bulk Actions Bar */}
        <UserBulkActionsBar
          selectedCount={selectedItems.size}
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
          onBulkAction={handleBulkAction}
          show={selectedItems.size > 0}
        />

        {/* Users Table */}
        <UsersTable
          users={currentUsers}
          selectedItems={selectedItems}
          loading={loading}
          sortConfig={sortConfig}
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          onSelectItem={selectItem}
          onSort={updateSort}
          onQuickView={handleQuickView}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          onPageChange={changePage}
          onPageSizeChange={changePageSize}
        />

        {/* Modals */}
        {showUserModal && (
          <UserModal
            mode={modalMode}
            user={selectedUser}
            onClose={() => setShowUserModal(false)}
            onSave={(data) => {
              // Handle save logic
              setShowUserModal(false);
              showToast(
                modalMode === "create"
                  ? "Đã tạo người dùng thành công"
                  : "Đã cập nhật người dùng thành công",
                "success"
              );
            }}
          />
        )}

        {showQuickView && selectedUser && (
          <UserQuickViewModal
            user={selectedUser}
            onClose={() => setShowQuickView(false)}
            onEdit={() => {
              setShowQuickView(false);
              handleEditUser(selectedUser.id);
            }}
            onDuplicate={() => {
              setShowQuickView(false);
              showToast("Đã nhân bản người dùng", "success");
            }}
          />
        )}

        {/* Toast Container */}
        <ToastContainer />
      </div>
    </AdminLayout>
  );
}
