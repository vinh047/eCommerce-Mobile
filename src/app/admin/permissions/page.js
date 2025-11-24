"use client";
import AdminLayout from "@/components/Layout/AdminLayout";
import {
  PermissionsHeader,
  PermissionsToolbar,
  PermissionBulkActionsBar,
  PermissionsTable,
  PermissionModal,
  // Không cần QuickView Modal vì quyền hạn thường đơn giản hơn
} from "./_components"; 
import { usePermissionsData } from "./hooks/usePermissionsData";
import { exportPermissionsCSV } from "./utils/exportPermissionCSV"; 
import { useState } from "react";

export default function PermissionsPage() {
  // 1. Hook quản lý dữ liệu và logic
  const {
    permissions, // Danh sách quyền hạn
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
    deletePermission, // Hàm xóa quyền hạn
    savePermission, // Hàm tạo/cập nhật quyền hạn
    handleBulkAction,
    onPageChange,
    onPageSizeChange,
  } = usePermissionsData(); 

  // 2. States quản lý Modal
  const [showPermissionModal, setShowPermissionModal] = useState(false); 
  const [modalMode, setModalMode] = useState("create");
  const [selectedPermission, setSelectedPermission] = useState(null); 
  // Không dùng QuickView ở đây, có thể mở modal Edit thay thế

  // 3. Handlers
  const handleCreatePermission = () => {
    // Mở modal tạo Permission mới
    setModalMode("create");
    setSelectedPermission(null);
    setShowPermissionModal(true);
  };

  const handleEditPermission = (permission) => {
    // Mở modal chỉnh sửa Permission
    setModalMode("edit");
    setSelectedPermission(permission);
    setShowPermissionModal(true);
  };

  const handleExportCSV = () => exportPermissionsCSV(filters, sortConfig); // Xử lý xuất CSV

  // 4. Render giao diện
  return (
    <AdminLayout>
      <div className="overflow-auto px-8 py-6">
        
        {/* Header - Chứa nút Tạo mới và Export CSV */}
        <PermissionsHeader 
          onCreatePermission={handleCreatePermission}
          onExportCSV={handleExportCSV}
        />

        {/* Toolbar - Chứa thanh Search và Filter */}
        <PermissionsToolbar 
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={() => setFilters({ search: "" })} 
        />

        {/* Bulk Actions Bar - Thanh hành động hàng loạt */}
        <PermissionBulkActionsBar 
          selectedCount={selectedItems.size}
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
          onBulkAction={handleBulkAction}
          show={selectedItems.size > 0}
        />

        {/* Table - Bảng hiển thị danh sách quyền hạn */}
        <PermissionsTable 
          permissions={permissions} 
          selectedItems={selectedItems}
          loading={loading}
          sortConfig={sortConfig}
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          onSelectItem={selectItem}
          onSort={updateSort}
          // Hàm để mở modal chỉnh sửa khi click vào nút edit trên mỗi dòng
          onEditPermission={(id) =>
            handleEditPermission(permissions.find((p) => p.id === id))
          }
          onDeletePermission={deletePermission}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />

        {/* Modal tạo/chỉnh sửa Permission */}
        {showPermissionModal && ( 
          <PermissionModal
            mode={modalMode}
            permission={selectedPermission}
            onClose={() => setShowPermissionModal(false)}
            onSave={async (data) => {
              // Gọi hàm lưu/cập nhật và đóng modal
              await savePermission(data, modalMode, selectedPermission);
              setShowPermissionModal(false);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
}