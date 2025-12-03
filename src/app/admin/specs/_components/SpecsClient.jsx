"use client";

import { useState, lazy, Suspense } from "react";
import { SpecsToolbar } from "./index";
import PageHeader from "@/components/common/PageHeader";
import TableSkeleton from "@/components/common/TableSkeleton";

import { useExportSpecsCSV } from "../utils/exportSpecsCSV";
import { useFetchSpecs } from "../hooks/useFetchSpecs";
import { PERMISSION_KEYS } from "../../constants/permissions";
import { useAuth } from "@/contexts/AuthContext";

const SpecsModal = lazy(() => import("./SpecsModal"));
const SpecBuilderDrawer = lazy(() => import("./SpecBuilderDrawer"));
const SpecsTable = lazy(() => import("./SpecsTable"));

export default function SpecsClient({ initialData, categories }) {
  const { specs, totalItems, isLoading, deleteSpec, saveSpec, saveSpecConfig } =
    useFetchSpecs(initialData);

  const [showModal, setShowModal] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedSpec, setSelectedSpec] = useState(null);

  const handleCreate = () => {
    setModalMode("create");
    setSelectedSpec(null);
    setShowModal(true);
  };

  const handleEditMeta = (spec) => {
    setModalMode("edit");
    setSelectedSpec(spec);
    setShowModal(true);
  };

  const handleConfigure = (spec) => {
    setSelectedSpec(spec);
    setShowBuilder(true);
  };

  const { exportSpecsCSV } = useExportSpecsCSV();

  const { hasPermission } = useAuth();

  if (!hasPermission(PERMISSION_KEYS.VIEW_SPEC)) {
    return (
      <div className="p-6 text-red-600">
        Bạn không có quyền truy cập trang này
      </div>
    );
  }

  return (
    <div className="overflow-auto px-8 py-6">
      <PageHeader
        title="Mẫu Thông số Kỹ thuật"
        onExport={exportSpecsCSV}
        onCreate={handleCreate}
        createLabel="Tạo Mẫu mới"
        permission={PERMISSION_KEYS.CREATE_SPEC}
      />

      <SpecsToolbar categories={categories} />

      <Suspense fallback={<TableSkeleton />}>
        <SpecsTable
          specs={specs}
          totalItems={totalItems}
          onEdit={handleEditMeta}
          onConfigure={handleConfigure}
          onDelete={deleteSpec}
        />
      </Suspense>

      {/* Modal CRUD Template cơ bản (Tên, Category) */}
      {showModal && (
        <Suspense fallback={<div>Loading...</div>}>
          <SpecsModal
            mode={modalMode}
            spec={selectedSpec}
            categories={categories}
            onClose={() => setShowModal(false)}
            onSave={async (data) => {
              await saveSpec(data, modalMode, selectedSpec);
              setShowModal(false);
            }}
          />
        </Suspense>
      )}

      {/* Drawer Builder phức tạp (Cấu hình Product Specs) */}
      {showBuilder && selectedSpec && (
        <Suspense fallback={<div>Loading Builder...</div>}>
          <SpecBuilderDrawer
            template={selectedSpec}
            onClose={() => setShowBuilder(false)}
            onSave={async (nestedData) => {
              await saveSpecConfig(selectedSpec.id, nestedData);
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
