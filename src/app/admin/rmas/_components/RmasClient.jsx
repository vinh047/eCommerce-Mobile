"use client";

import { useState, lazy, Suspense } from "react";
import RmasHeader from "./RmasHeader";
import RmasToolbar from "./RmasToolbar";
import RmasTable from "./RmasTable";


import { useFetchRmas } from "../hooks/useFetchRmas";
import TableSkeleton from "@/components/common/TableSkeleton";
import { UserBulkActionsBar } from "../../users/_components";

const RmasModal = lazy(() => import("./RmasModal")); // Modal xử lý
const RmasCreateModal = lazy(() => import("./RmasCreateModal"));
const RmasQuickViewModal = lazy(() => import("./RmasQuickViewModal"));

export default function RmasClient({ initialData }) {
  const {
    rmas,
    totalItems,
    isLoading,
    selectedItems,
    selectItem,
    selectAll,
    deselectAll,
    deleteRma,
    saveRma,
    handleBulkAction,
  } = useFetchRmas(initialData);

  // UI States
  const [showCreateModal, setShowCreateModal] = useState(false); // State cho modal tạo
  const [showEditModal, setShowEditModal] = useState(false); // State cho modal xử lý
  const [selectedRma, setSelectedRma] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);

  // Handler: Mở modal tạo mới
  const handleCreate = () => {
    setShowCreateModal(true);
  };

  // Handler: Mở modal xử lý (Edit)
  const handleEdit = (rma) => {
    setSelectedRma(rma);
    setShowEditModal(true);
  };

  // Handler: Mở Quick View
  const handleQuickView = (rma) => {
    setSelectedRma(rma);
    setShowQuickView(true);
  };

  return (
    <div className="overflow-auto px-8 py-6">
      {/* Truyền hàm handleCreate xuống Header */}
      <RmasHeader onCreate={handleCreate} />

      <RmasToolbar />

      {UserBulkActionsBar && (
        <UserBulkActionsBar
          selectedCount={selectedItems.size}
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
          onBulkAction={handleBulkAction}
          show={selectedItems.size > 0}
        />
      )}

      <div className="mt-4">
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <RmasTable
            rmas={rmas}
            selectedItems={selectedItems}
            totalItems={totalItems}
            onSelectItem={selectItem}
            onQuickView={handleQuickView}
            onEdit={handleEdit}
            onDelete={deleteRma}
          />
        )}
      </div>

      {/* Modal Xử lý (Edit) */}
      {showEditModal && selectedRma && (
        <Suspense
          fallback={<div className="fixed inset-0 bg-black/20 z-50"></div>}
        >
          <RmasModal
            rma={selectedRma}
            onClose={() => setShowEditModal(false)}
            onSave={async (data) => {
              await saveRma(data, "edit", selectedRma);
              setShowEditModal(false);
            }}
          />
        </Suspense>
      )}

      {/* Modal Tạo Mới (Create) */}
      {showCreateModal && (
        <Suspense
          fallback={<div className="fixed inset-0 bg-black/20 z-50"></div>}
        >
          <RmasCreateModal
            onClose={() => setShowCreateModal(false)}
            onSave={async (data) => {
              // Gọi saveRma với mode "create"
              await saveRma(data, "create", null);
              setShowCreateModal(false);
            }}
          />
        </Suspense>
      )}

      {/* Modal Quick View */}
      {showQuickView && selectedRma && (
        <Suspense fallback={null}>
          <RmasQuickViewModal
            rma={selectedRma}
            onClose={() => setShowQuickView(false)}
            onEdit={() => {
              setShowQuickView(false);
              handleEdit(selectedRma);
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
