"use client";

import { useState, lazy, Suspense } from "react";
import { VariantsToolbar } from "./index";
import { useFetchVariants } from "../hooks/useFetchVariants";
import { useExportVariantsCSV } from "../utils/exportVariantsCSV";
import PageHeader from "@/components/common/PageHeader";
import TableSkeleton from "@/components/common/TableSkeleton";
import { UserBulkActionsBar } from "../../users/_components";
import { PERMISSION_KEYS } from "../../constants/permissions";
import { useAuth } from "@/contexts/AuthContext";

const VariantModal = lazy(() => import("./VariantModal"));
const VariantQuickViewModal = lazy(() => import("./QuickViewModal"));
const VariantsTable = lazy(() => import("./VariantsTable"));

export default function VariantsClient({
  initialVariants,
  initialProducts,
}) {
  const {
    variants,
    totalItems,
    selectedItems,
    selectItem,
    selectAll,
    deselectAll,
    deleteVariant,
    saveVariant,
    handleBulkAction,
  } = useFetchVariants(initialVariants);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);

  const { exportVariantsCSV } = useExportVariantsCSV();
  const { hasPermission } = useAuth();

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

  if (!hasPermission(PERMISSION_KEYS.VIEW_VARIANT)) {
    return (
      <div className="p-6 text-red-600">
        Bạn không có quyền truy cập trang này
      </div>
    );
  }

  return (
    <div className="overflow-auto px-8 py-6">
      <PageHeader
        title="Quản lý Biến thể Sản phẩm"
        onExport={exportVariantsCSV}
        onCreate={handleCreate}
        exportLabel="Xuất Excel"
        createLabel="Thêm biến thể"
        permission={PERMISSION_KEYS.CREATE_VARIANT}
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

      {showModal && (
        <Suspense
          fallback={<div className="p-6 text-center">Loading modal...</div>}
        >
          <VariantModal
            mode={modalMode}
            variant={selectedVariant}
            allProducts={initialProducts}
            onClose={() => setShowModal(false)}
            onSave={async (data) => {
              await saveVariant(data, modalMode, selectedVariant);
              setShowModal(false);
            }}
          />
        </Suspense>
      )}

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
