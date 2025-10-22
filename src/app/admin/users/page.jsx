"use client";
import AdminLayout from "@/components/Layout/AdminLayout";
import {
  UsersHeader,
  UsersToolbar,
  UserBulkActionsBar,
  UsersTable,
  UserModal,
  UserQuickViewModal,
} from "./_components";
import { useUsersData } from "./hooks/useUsersData";
import { exportUsersCSV } from "./utils/exportUsersCSV";
import { useState } from "react";

export default function UsersPage() {
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
  } = useUsersData();

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

  const handleExportCSV = () => exportUsersCSV(filters, sortConfig);

  return (
    <AdminLayout>
      <div className="overflow-auto px-8 py-6">
        <UsersHeader
          onCreateUser={handleCreateUser}
          onExportCSV={handleExportCSV}
        />

        <UsersToolbar
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={() => setFilters({ search: "", status: "" })}
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
            onSave={async (data) => {
              await saveUser(data, modalMode, selectedUser);
              setShowUserModal(false);
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
      </div>
    </AdminLayout>
  );
}
