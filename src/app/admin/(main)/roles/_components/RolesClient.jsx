"use client";

import { useState, Suspense, lazy } from "react";
import { Plus } from "lucide-react";
// import PageHeader from "@/components/common/PageHeader";
import { useFetchRoles } from "../hooks/useFetchRoles";
import { useAuth } from "@/contexts/AuthContext";
import { PERMISSION_KEYS } from "../../constants/permissions";
import PermissionGate from "../../../_components/PermissionGate";

// Lazy load Components
const RolesTable = lazy(() => import("./RolesTable"));
const RolesModal = lazy(() => import("./RolesModal"));

export default function RolesClient({ initialRoles, initialPermissions }) {
  const { roles, deleteRole, saveRole } = useFetchRoles(initialRoles);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedRole, setSelectedRole] = useState(null);

  const handleCreate = () => {
    setModalMode("create");
    setSelectedRole(null);
    setShowModal(true);
  };

  const handleEdit = (role) => {
    setModalMode("edit");
    setSelectedRole(role);
    setShowModal(true);
  };

  const { hasPermission } = useAuth();

  if (!hasPermission(PERMISSION_KEYS.VIEW_ROLE)) {
    return (
      <div className="p-6 text-red-600">
        Bạn không có quyền truy cập trang này
      </div>
    );
  }

  return (
    <div className="px-8 py-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Quản lý Phân quyền
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Thiết lập vai trò và quyền hạn cho nhân viên trong hệ thống.
          </p>
        </div>
        <PermissionGate permission={PERMISSION_KEYS.UPDATE_ROLE}>
          <button
            onClick={handleCreate}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            Tạo Vai trò mới
          </button>
        </PermissionGate>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <Suspense
          fallback={
            <div className="p-8 text-center text-gray-500">
              Đang tải dữ liệu...
            </div>
          }
        >
          <RolesTable roles={roles} onEdit={handleEdit} onDelete={deleteRole} />
        </Suspense>
      </div>

      {/* Modal Section */}
      {showModal && (
        <Suspense fallback={null}>
          <RolesModal
            mode={modalMode}
            role={selectedRole}
            onClose={() => setShowModal(false)}
            onSave={async (data) => {
              await saveRole(data, modalMode, selectedRole);
              setShowModal(false);
            }}
            permissions={initialPermissions}
          />
        </Suspense>
      )}
    </div>
  );
}
