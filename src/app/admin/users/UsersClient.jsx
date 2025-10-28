// =========================================================
// UsersClient.jsx (Phiên bản Hoàn Chỉnh & Tối ưu hóa)
// =========================================================
"use client";

import { useState, lazy, Suspense } from "react";
// Đảm bảo import đúng tên hàm/component từ _components
import { UsersHeader, UsersToolbar, UserBulkActionsBar } from "./_components";
import { useFetchUsers } from "./hooks/useFetchUsers"; // Tên hook đã được đổi thành useFetchUsers
import { exportUsersCSV } from "./utils/exportUsersCSV";
import UsersTableSkeleton from "./_components/UsersTableSkeleton";

// Lazy load modals và table
const UsersModal = lazy(() => import("./_components/UsersModal"));
const UsersQuickViewModal = lazy(() => import("./_components/QuickViewModal"));
const UsersTable = lazy(() => import("./_components/UsersTable"));

// ⭐️ Nhận initialUsers (dữ liệu thô) và searchParams từ Server Component
export default function UsersClient({ initialUsers, searchParams }) {
  // 1. Hook Dữ liệu (Sử dụng tên hook mới và cấu trúc trả về mới)
  const {
    users,
    totalItems,

    // Handlers & States từ useTableState
    filters,
    sortConfig,
    currentPage,
    pageSize,
    onFilterChange,
    onSortChange,
    onPageChange,
    onPageSizeChange,

    // Selection Handlers & States
    selectedItems,
    selectAllForFilter,
    selectItem,
    selectAll,
    deselectAll,

    // CRUD Handlers
    deleteUser,
    saveUser,
    handleBulkAction,
    // fetchUsers (Không cần export nếu không dùng nút refresh thủ công)
  } = useFetchUsers(initialUsers); // Truyền initial data vào hook

  // 2. State UI (Quản lý Modal/Quick View)
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);

  // ===== Handlers UI =====

  const handleCreateUser = () => {
    setModalMode("create");
    setSelectedUser(null); // Đảm bảo null cho mode 'create'
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setModalMode("edit");
    setSelectedUser(user);
    setShowUserModal(true);
  };

  // Hàm tìm User bằng ID (dùng trong UsersTable)
  const findUserById = (id) => users.find((u) => u.id === id);

  const handleExportCSV = () => exportUsersCSV(filters, sortConfig);

  return (
    <div className="overflow-auto px-8 py-6">
      <UsersHeader
        onCreateUser={handleCreateUser}
        onExportCSV={handleExportCSV}
      />

      {/* Điều chỉnh UsersToolbar để dùng onFilterChange */}
      <UsersToolbar filters={filters} onFilterChange={onFilterChange} />

      <UserBulkActionsBar
        selectedCount={selectedItems.size}
        onSelectAll={selectAll}
        onDeselectAll={deselectAll}
        onBulkAction={handleBulkAction}
        show={selectedItems.size > 0}
      />

      <Suspense fallback={<UsersTableSkeleton />}>
        <UsersTable
          users={users}
          selectedItems={selectedItems}
          sortConfig={sortConfig}
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          // Handlers cho bảng
          onSelectItem={selectItem}
          onSort={onSortChange}
          // Handlers cho từng hàng
          onQuickView={handleEditUser}
          onEditUser={(id) => handleEditUser(findUserById(id))}
          onDeleteUser={deleteUser}
          // Pagination Handlers
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </Suspense>

      {/* Lazy-loaded User Modal */}
      {showUserModal && (
        <Suspense
          fallback={<div className="p-6 text-center">Loading modal...</div>}
        >
          <UsersModal
            mode={modalMode}
            user={selectedUser}
            onClose={() => setShowUserModal(false)}
            onSave={async (data) => {
              await saveUser(data, modalMode, selectedUser);
              setShowUserModal(false);
            }}
          />
        </Suspense>
      )}

      {/* Lazy-loaded Quick View Modal */}
      {showQuickView && selectedUser && (
        <Suspense
          fallback={
            <div className="p-6 text-center">Loading quick view...</div>
          }
        >
          <UsersQuickViewModal
            user={selectedUser}
            onClose={() => setShowQuickView(false)}
            onEdit={() => {
              setShowQuickView(false);
              handleEditUser(selectedUser);
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
