"use client";

import { useState, lazy, Suspense } from "react";
import BannerHeader from "./BannerHeader";
import BannerToolbar from "./BannerToolbar";
import BannerTable from "./BannerTable";
import { useFetchBanners } from "../hooks/useFetchBanners";
import TableSkeleton from "@/components/common/TableSkeleton";
import { UserBulkActionsBar } from "../../users/_components";
import { useAuth } from "@/contexts/AuthContext";
import { PERMISSION_KEYS } from "../../constants/permissions";

const BannerModal = lazy(() => import("./BannerModal"));
const BannerQuickViewModal = lazy(() => import("./BannerQuickViewModal"));

export default function BannerClient({ initialData }) {
  const {
    banners,
    totalItems,
    isLoading,
    selectedItems,
    selectItem,
    selectAll,
    deselectAll,
    deleteBanner,
    saveBanner,
    handleBulkAction,
  } = useFetchBanners(initialData);

  // UI States
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);

  const handleCreate = () => {
    setModalMode("create");
    setSelectedBanner(null);
    setShowModal(true);
  };

  const handleEdit = (banner) => {
    setModalMode("edit");
    setSelectedBanner(banner);
    setShowModal(true);
  };

  const handleQuickView = (banner) => {
    setSelectedBanner(banner);
    setShowQuickView(true);
  };

  const { hasPermission } = useAuth();

  // Thay đổi PERMISSION_KEYS tương ứng với Banner
  if (!hasPermission(PERMISSION_KEYS.VIEW_BANNER)) {
    return (
      <div className="p-6 text-red-600">
        Bạn không có quyền truy cập trang này
      </div>
    );
  }

  return (
    <div className="overflow-auto px-8 py-6">
      <BannerHeader onCreate={handleCreate} />

      <BannerToolbar />

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
          <BannerTable
            banners={banners}
            selectedItems={selectedItems}
            totalItems={totalItems}
            onSelectItem={selectItem}
            onQuickView={handleQuickView}
            onEdit={handleEdit}
            onDelete={deleteBanner}
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
          <BannerModal
            mode={modalMode}
            banner={selectedBanner}
            onClose={() => setShowModal(false)}
            onSave={async (data) => {
              await saveBanner(data, modalMode, selectedBanner);
              setShowModal(false);
            }}
          />
        </Suspense>
      )}

      {showQuickView && selectedBanner && (
        <Suspense fallback={null}>
          <BannerQuickViewModal
            banner={selectedBanner}
            onClose={() => setShowQuickView(false)}
            onEdit={() => {
              setShowQuickView(false);
              handleEdit(selectedBanner);
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
