"use client";

import { useState, lazy, Suspense } from "react";
import { BrandsToolbar, BrandBulkActionsBar } from "./index";

import { useExportBrandsCSV } from "../utils/exportBrandsCSV";
import PageHeader from "@/components/common/PageHeader";
import TableSkeleton from "@/components/common/TableSkeleton";
import { useFetchBrands } from "../hooks/useFetchBrands";

const BrandsModal = lazy(() => import("./BrandsModal"));
const BrandQuickViewModal = lazy(() => import("./BrandQuickViewModal"));
const BrandsTable = lazy(() => import("./BrandsTable"));

export default function BrandsClient({ initialBrands }) {
  const {
    brands,
    totalItems,
    selectedItems,
    selectItem,
    selectAll,
    deselectAll,
    deleteBrand,
    saveBrand,
    handleBulkAction,
  } = useFetchBrands(initialBrands);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);

  const handleCreate = () => {
    setModalMode("create");
    setSelectedBrand(null);
    setShowModal(true);
  };

  const handleEdit = (brand) => {
    setModalMode("edit");
    setSelectedBrand(brand);
    setShowModal(true);
  };

  const handleQuickView = (brand) => {
    setSelectedBrand(brand);
    setShowQuickView(true);
  };

  const { exportBrandsCSV } = useExportBrandsCSV();

  return (
    <div className="overflow-auto px-8 py-6">
      <PageHeader
        title="Quản lý Thương hiệu"
        onExport={exportBrandsCSV}
        onCreate={handleCreate}
        exportLabel="Xuất Excel"
        createLabel="Thêm thương hiệu"
      />

      <BrandsToolbar />

      <BrandBulkActionsBar
        selectedCount={selectedItems.size}
        onSelectAll={selectAll}
        onDeselectAll={deselectAll}
        onBulkAction={handleBulkAction}
        show={selectedItems.size > 0}
      />

      <Suspense fallback={<TableSkeleton />}>
        <BrandsTable
          brands={brands}
          selectedItems={selectedItems}
          totalItems={totalItems}
          onSelectItem={selectItem}
          onQuickView={handleQuickView}
          onEdit={handleEdit}
          onDelete={deleteBrand}
        />
      </Suspense>

      {showModal && (
        <Suspense fallback={<div>Loading...</div>}>
          <BrandsModal
            mode={modalMode}
            brand={selectedBrand}
            onClose={() => setShowModal(false)}
            onSave={async (data) => {
              await saveBrand(data, modalMode, selectedBrand);
              setShowModal(false);
            }}
          />
        </Suspense>
      )}

      {showQuickView && selectedBrand && (
        <Suspense fallback={<div>Loading...</div>}>
          <BrandQuickViewModal
            brand={selectedBrand}
            onClose={() => setShowQuickView(false)}
            onEdit={() => {
              setShowQuickView(false);
              handleEdit(selectedBrand);
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
