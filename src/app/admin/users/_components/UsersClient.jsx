"use client";

import { useState, lazy, Suspense } from "react";
import { UsersHeader, UsersToolbar, UserBulkActionsBar } from "./index";
import { useFetchUsers } from "../hooks/useFetchUsers";
import { exportUsersCSV, useExportUsersCSV } from "../utils/exportUsersCSV";
import PageHeader from "@/components/common/PageHeader";
import TableSkeleton from "@/components/common/TableSkeleton";
import { PERMISSION_KEYS } from "../../constants/permissions";
import { useAuth } from "@/contexts/AuthContext";

const UsersModal = lazy(() => import("./UsersModal"));
const UsersQuickViewModal = lazy(() => import("./QuickViewModal"));
const UsersTable = lazy(() => import("./UsersTable"));

export default function UsersClient({ initialUsers, searchParams }) {
  const {
    users,
    totalItems,

    // Selection Handlers & States
    selectedItems,
    selectItem,
    selectAll,
    deselectAll,

    // CRUD Handlers
    deleteUser,
    saveUser,
    handleBulkAction,
  } = useFetchUsers(initialUsers);

  // 2. State UI (Quản lý Modal/Quick View)
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);

  // ===== Handlers UI =====

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

  const findUserById = (id) => users.find((u) => u.id === id);
  const { exportUsersCSV } = useExportUsersCSV();

  const { hasPermission } = useAuth();

  if (!hasPermission(PERMISSION_KEYS.VIEW_CUSTOMER)) {
    return (
      <div className="p-6 text-red-600">
        Bạn không có quyền truy cập trang này
      </div>
    );
  }

  return (
    <div className="overflow-auto px-8 py-6">
      <PageHeader
        title="Quản lý Người dùng"
        onExport={exportUsersCSV}
        onCreate={handleCreateUser}
        exportLabel="Xuất Excel"
        createLabel="Tạo người dùng"
        permission={PERMISSION_KEYS.CREATE_CUSTOMER}
      />

      <UsersToolbar />

      <UserBulkActionsBar
        selectedCount={selectedItems.size}
        onSelectAll={selectAll}
        onDeselectAll={deselectAll}
        onBulkAction={handleBulkAction}
        show={selectedItems.size > 0}
      />

      <Suspense fallback={<TableSkeleton />}>
        <UsersTable
          users={users}
          selectedItems={selectedItems}
          totalItems={totalItems}
          onSelectItem={selectItem}
          onQuickView={handleQuickView}
          onEditUser={handleEditUser}
          onDeleteUser={deleteUser}
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
