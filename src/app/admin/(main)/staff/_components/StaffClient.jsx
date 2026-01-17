"use client";

import { useState, lazy, Suspense } from "react";
import StaffHeader from "./StaffHeader";
import StaffToolbar from "./StaffToolbar";
import StaffTable from "./StaffTable";
import { useFetchStaff } from "../hooks/useFetchStaff";
import PageHeader from "@/components/common/PageHeader";
import TableSkeleton from "@/components/common/TableSkeleton";
import { UserBulkActionsBar } from "../../users/_components";
import { useAuth } from "@/contexts/AuthContext";
import { PERMISSION_KEYS } from "../../constants/permissions";

const StaffModal = lazy(() => import("./StaffModal"));
const StaffQuickViewModal = lazy(() => import("./StaffQuickViewModal"));

export default function StaffClient({ initialData }) {
  const {
    staffs,
    totalItems,
    isLoading,
    selectedItems,
    selectItem,
    selectAll,
    deselectAll,
    deleteStaff,
    saveStaff,
    handleBulkAction,
  } = useFetchStaff(initialData);

  // UI States
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);

  const handleCreate = () => {
    setModalMode("create");
    setSelectedStaff(null);
    setShowModal(true);
  };

  const handleEdit = (staff) => {
    setModalMode("edit");
    setSelectedStaff(staff);
    setShowModal(true);
  };

  const handleQuickView = (staff) => {
    setSelectedStaff(staff);
    setShowQuickView(true);
  };

  const { hasPermission } = useAuth();

  if (!hasPermission(PERMISSION_KEYS.VIEW_STAFF)) {
    return (
      <div className="p-6 text-red-600">
        Bạn không có quyền truy cập trang này
      </div>
    );
  }

  return (
    <div className="overflow-auto px-8 py-6">
      <StaffHeader onCreate={handleCreate} />

      <StaffToolbar />

      <UserBulkActionsBar
        selectedCount={selectedItems.size}
        onSelectAll={selectAll}
        onDeselectAll={deselectAll}
        onBulkAction={handleBulkAction}
        show={selectedItems.size > 0}
      />

      <div className="mt-4">
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <StaffTable
            staffs={staffs}
            selectedItems={selectedItems}
            totalItems={totalItems}
            onSelectItem={selectItem}
            onQuickView={handleQuickView}
            onEdit={handleEdit}
            onDelete={deleteStaff}
          />
        )}
      </div>

      {showModal && (
        <Suspense
          fallback={
            <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
              Loading...
            </div>
          }
        >
          <StaffModal
            mode={modalMode}
            staff={selectedStaff}
            onClose={() => setShowModal(false)}
            onSave={async (data) => {
              await saveStaff(data, modalMode, selectedStaff);
              setShowModal(false);
            }}
          />
        </Suspense>
      )}

      {showQuickView && selectedStaff && (
        <Suspense fallback={null}>
          <StaffQuickViewModal
            staff={selectedStaff}
            onClose={() => setShowQuickView(false)}
            onEdit={() => {
              setShowQuickView(false);
              handleEdit(selectedStaff);
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
