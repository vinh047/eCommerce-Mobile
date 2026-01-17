"use client";

import { useState, lazy, Suspense } from "react";
import {
  CategoriesToolbar,
  CategoryBulkActionsBar,
  CategoriesHeader,
} from "./index";
import { useFetchCategories } from "../hooks/useFetchCategories";
import PageHeader from "@/components/common/PageHeader";
import TableSkeleton from "@/components/common/TableSkeleton";
import { useExportCategoriesCSV } from "../utils/exportCategoriesCSV";
import { useAuth } from "@/contexts/AuthContext";
import { PERMISSION_KEYS } from "../../constants/permissions";

const CategoriesModal = lazy(() => import("./CategoriesModal"));
const CategoryQuickViewModal = lazy(() => import("./CategoryQuickViewModal"));
const CategoriesTable = lazy(() => import("./CategoriesTable"));

export default function CategoriesClient({ initialCategories }) {
  const {
    categories,
    totalItems,
    selectedItems,
    selectItem,
    selectAll,
    deselectAll,
    deleteCategory,
    saveCategory,
    handleBulkAction,
  } = useFetchCategories(initialCategories);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);

  const handleCreate = () => {
    setModalMode("create");
    setSelectedCategory(null);
    setShowModal(true);
  };

  const handleEdit = (cat) => {
    setModalMode("edit");
    setSelectedCategory(cat);
    setShowModal(true);
  };

  const handleQuickView = (cat) => {
    setSelectedCategory(cat);
    setShowQuickView(true);
  };

  const { exportCategoriesCSV } = useExportCategoriesCSV();

  const { hasPermission } = useAuth();

  if (!hasPermission(PERMISSION_KEYS.VIEW_CATEGORY)) {
    return (
      <div className="p-6 text-red-600">
        Bạn không có quyền truy cập trang này
      </div>
    );
  }

  return (
    <div className="overflow-auto px-8 py-6">
      <PageHeader
        title="Quản lý Danh mục"
        onExport={exportCategoriesCSV}
        onCreate={handleCreate}
        exportLabel="Xuất Excel"
        createLabel="Thêm danh mục"
        permission={PERMISSION_KEYS.CREATE_CATEGORY}
      />

      <CategoriesToolbar />

      <CategoryBulkActionsBar
        selectedCount={selectedItems.size}
        onSelectAll={selectAll}
        onDeselectAll={deselectAll}
        onBulkAction={handleBulkAction}
        show={selectedItems.size > 0}
      />

      <Suspense fallback={<TableSkeleton />}>
        <CategoriesTable
          categories={categories}
          selectedItems={selectedItems}
          totalItems={totalItems}
          onSelectItem={selectItem}
          onQuickView={handleQuickView}
          onEdit={handleEdit}
          onDelete={deleteCategory}
        />
      </Suspense>

      {showModal && (
        <Suspense fallback={<div>Loading...</div>}>
          <CategoriesModal
            mode={modalMode}
            category={selectedCategory}
            allCategories={categories}
            onClose={() => setShowModal(false)}
            onSave={async (data) => {
              await saveCategory(data, modalMode, selectedCategory);
              setShowModal(false);
            }}
          />
        </Suspense>
      )}

      {showQuickView && selectedCategory && (
        <Suspense fallback={<div>Loading...</div>}>
          <CategoryQuickViewModal
            category={selectedCategory}
            onClose={() => setShowQuickView(false)}
            onEdit={() => {
              setShowQuickView(false);
              handleEdit(selectedCategory);
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
