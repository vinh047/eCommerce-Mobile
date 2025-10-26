// UsersClient.jsx
"use client";

import { useState, lazy, Suspense } from "react";
import { UsersHeader, UsersToolbar, UserBulkActionsBar } from "./_components";
import { useUsersData } from "./hooks/useUsersData"; // Đảm bảo đường dẫn này đúng
import { exportUsersCSV } from "./utils/exportUsersCSV"; // Đảm bảo đường dẫn này đúng

// Lazy load modals và table
const UsersModal = lazy(() => import("./_components/UsersModal"));
const UsersQuickViewModal = lazy(() => import("./_components/QuickViewModal"));
const UsersTable = lazy(() => import("./_components/UsersTable"));

// ⭐️ Nhận thêm initialState và initialTotalItems
export default function UsersClient({ initialUsers, searchParams }) {
  console.log(searchParams);
  const {
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
  } = useUsersData(initialUsers);

  const [showUserModal, setShowUserModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);

  // ===== Handlers =====
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

  const handleExportCSV = () => exportUsersCSV(filters, sortConfig);

  return (
    <div className="overflow-auto px-8 py-6">
      <UsersHeader
        onCreateUser={handleCreateUser}
        onExportCSV={handleExportCSV}
      />

      {/* <UsersToolbar
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={() => setFilters({ search: "", status: [] })}
      /> */}
      <UsersToolbar />
      <UserBulkActionsBar
        selectedCount={selectedItems.size}
        onSelectAll={selectAll}
        onDeselectAll={deselectAll}
        onBulkAction={handleBulkAction}
        show={selectedItems.size > 0}
      />

      <Suspense
        fallback={<div className="p-6 text-center">Loading table...</div>}
      >
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
      </Suspense>

      {/* Lazy-loaded User Modal */}
      {showUserModal && (
        <Suspense
          fallback={<div className="p-6 text-center">Loading modal...</div>}
        >
          <UsersModal // Tên component này là UserModal hay UsersModal?
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
          <UsersQuickViewModal // Tên component này là UserQuickViewModal hay UsersQuickViewModal?
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
