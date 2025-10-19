"use client";

import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/Layout/AdminLayout";
import usersApi from "@/lib/api/usersApi";
import UsersTable from "@/app/admin/users/_components/UsersTable";
import UsersHeader from "@/app/admin/users/_components/UsersHeader";
import UsersToolbar from "@/app/admin/users/_components/UsersToolbar";
import UserBulkActionsBar from "@/app/admin/users/_components/BulkActionsBar";
import UserQuickViewModal from "@/app/admin/users/_components/QuickViewModal";
import UserModal from "@/app/admin/users/_components/UsersModal";
import ToastContainer from "@/components/ui/ToastContainer";
import { useToast } from "@/hooks/useToast";
import { usePaginationQuery } from "@/hooks/usePaginationQuery";

export default function UsersPage() {
  const { showToast } = useToast();

  // --- States ---
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

  // --- Fetch users ---
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

      setUsers(res.data.data);
      setTotalItems(res.data.pagination.totalItems);
    } catch (err) {
      console.error("Fetch users failed:", err);
      showToast("Không thể tải danh sách người dùng", "error");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filters, sortConfig, showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // --- Sort ---
  const updateSort = useCallback((column) => {
    setSortConfig((prev) => ({
      column,
      direction:
        prev.column === column && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  // --- Select ---
  const selectItem = useCallback((id, selected) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (selected) newSet.add(id);
      else newSet.delete(id);
      return newSet;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedItems(new Set(users.map((u) => u.id)));
  }, [users]);

  const deselectAll = useCallback(() => setSelectedItems(new Set()), []);

  // --- Delete user ---
  const deleteUser = useCallback(
    async (id) => {
      if (!confirm("Bạn có chắc muốn xóa người dùng này?")) return;
      setLoading(true);
      try {
        await usersApi.deleteUser(id);
        showToast("Đã xóa người dùng thành công", "success");
        fetchUsers();
      } catch (err) {
        showToast("Xóa thất bại", "error");
      } finally {
        setLoading(false);
      }
    },
    [fetchUsers, showToast]
  );

  // --- Bulk Action ---
  const handleBulkAction = useCallback(
    async (action) => {
      if (selectedItems.size === 0)
        return showToast("Chưa chọn người dùng nào", "warning");

      if (
        action === "delete" &&
        !confirm(`Bạn có chắc muốn xóa ${selectedItems.size} người dùng?`)
      )
        return;

      try {
        await usersApi.bulkAction(Array.from(selectedItems), action);
        showToast(`Đã ${action} ${selectedItems.size} người dùng`, "success");
        setSelectedItems(new Set());
        fetchUsers();
      } catch (err) {
        console.error(err);
        showToast("Thao tác thất bại", "error");
      }
    },
    [selectedItems, fetchUsers, showToast]
  );

  // --- Modal ---
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);

  const handleCreateUser = () => {
    setModalMode("create");
    setSelectedUser(null);
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setModalMode("edit");
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleQuickView = (user) => {
    setSelectedUser(user);
    setShowQuickView(true);
  };

  // --- Render ---
  return (
    <AdminLayout>
      <div className="overflow-auto px-8 py-6">
        <UsersHeader
          onCreateUser={handleCreateUser}
          onExportCSV={() => showToast("Đang xuất CSV...", "info")}
        />

        <UsersToolbar
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={() => {
            setFilters({ search: "", status: "" });
            showToast("Đã xóa bộ lọc", "success");
          }}
        />

        <UserBulkActionsBar
          selectedCount={selectedItems.size}
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
          onBulkAction={handleBulkAction}
          show={selectedItems.size > 0}
        />

        <UsersTable
          users={users}
          selectedItems={selectedItems}
          loading={loading}
          sortConfig={sortConfig}
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          onSelectItem={selectItem}
          onSort={updateSort}
          onQuickView={handleQuickView}
          onEditUser={(id) => handleEditUser(users.find((u) => u.id === id))}
          onDeleteUser={deleteUser}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />

        {showUserModal && (
          <UserModal
            mode={modalMode}
            user={selectedUser}
            onClose={() => setShowUserModal(false)}
            onSave={() => {
              setShowUserModal(false);
              showToast(
                modalMode === "create"
                  ? "Tạo người dùng thành công"
                  : "Cập nhật thành công",
                "success"
              );
              fetchUsers();
            }}
          />
        )}

        {showQuickView && selectedUser && (
          <UserQuickViewModal
            user={selectedUser}
            onClose={() => setShowQuickView(false)}
            onEdit={() => {
              setShowQuickView(false);
              handleEditUser(selectedUser);
            }}
          />
        )}

        <ToastContainer />
      </div>
    </AdminLayout>
  );
}
