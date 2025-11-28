"use client";

import { useState, lazy, Suspense } from "react";
import { VariantsHeader, VariantsToolbar } from "./index";
// Giả định bạn sẽ tạo hook này tương tự useFetchUsers
import { useFetchVariants } from "../hooks/useFetchVariants";
import {
  exportVariantsCSV,
  useExportVariantsCSV,
} from "../utils/exportVariantsCSV";
import PageHeader from "@/components/common/PageHeader";
import TableSkeleton from "@/components/common/TableSkeleton";
import { UserBulkActionsBar } from "../../users/_components";

const VariantModal = lazy(() => import("./VariantModal"));
const VariantQuickViewModal = lazy(() => import("./QuickViewModal"));
const VariantsTable = lazy(() => import("./VariantsTable"));

export default function VariantsClient({
  initialVariants,
  initialProducts,
  initialVariantSpecs,
}) {
  const {
    variants,
    totalItems,
    // Selection Handlers & States
    selectedItems,
    selectItem,
    selectAll,
    deselectAll,
    // CRUD Handlers
    deleteVariant,
    saveVariant,
    handleBulkAction,
  } = useFetchVariants(initialVariants); // Hook giả định

  // UI State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);

  // Handlers
  const handleCreate = () => {
    setModalMode("create");
    setSelectedVariant(null);
    setShowModal(true);
  };

  const handleEdit = (variant) => {
    setModalMode("edit");
    setSelectedVariant(variant);
    setShowModal(true);
  };

  const handleQuickView = (variant) => {
    setSelectedVariant(variant);
    setShowQuickView(true);
  };

  const { exportVariantsCSV } = useExportVariantsCSV();

  return (
    <div className="overflow-auto px-8 py-6">
      <PageHeader
        title="Quản lý Biến thể Sản phẩm"
        onExport={exportVariantsCSV}
        onCreate={handleCreate}
        exportLabel="Xuất Excel"
        createLabel="Thêm biến thể"
      />

      <VariantsToolbar />

      <UserBulkActionsBar
        selectedCount={selectedItems.size}
        onSelectAll={selectAll}
        onDeselectAll={deselectAll}
        onBulkAction={handleBulkAction}
        show={selectedItems.size > 0}
      />

      <Suspense fallback={<TableSkeleton />}>
        <VariantsTable
          variants={variants}
          selectedItems={selectedItems}
          totalItems={totalItems}
          onSelectItem={selectItem}
          onQuickView={handleQuickView}
          onEdit={handleEdit}
          onDelete={deleteVariant}
        />
      </Suspense>

      {/* Modal Form */}
      {showModal && (
        <Suspense
          fallback={<div className="p-6 text-center">Loading modal...</div>}
        >
          <VariantModal
            mode={modalMode}
            variant={selectedVariant}
            allProducts={initialProducts}
            allSpecs={initialVariantSpecs}
            onClose={() => setShowModal(false)}
            onSave={async (data) => {
              await saveVariant(data, modalMode, selectedVariant);
              setShowModal(false);
            }}
          />
        </Suspense>
      )}

      {/* Quick View */}
      {showQuickView && selectedVariant && (
        <Suspense
          fallback={
            <div className="p-6 text-center">Loading quick view...</div>
          }
        >
          <VariantQuickViewModal
            variant={selectedVariant}
            onClose={() => setShowQuickView(false)}
            onEdit={() => {
              setShowQuickView(false);
              handleEdit(selectedVariant);
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
