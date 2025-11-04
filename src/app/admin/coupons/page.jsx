"use client";
import AdminLayout from "@/components/Layout/AdminLayout";
import {
  CouponsHeader,
  CouponsToolbar,
  CouponBulkActionsBar,
  CouponsTable,
  CouponModal,
  CouponQuickViewModal,
} from "./_components"; 
import { useCouponsData } from "./hooks/useCouponsData";
import { exportCouponsCSV } from "./utils/exportCouponCSV"; 
import { useState } from "react";

export default function CouponsPage() {

  const {
    coupons,
    loading,
    totalItems,
    filters,
    sortConfig,
    currentPage,
    pageSize,
    selectedItems,
    setFilters,
    fetchCoupons, 
    updateSort,
    selectItem,
    selectAll,
    deselectAll,
    deleteCoupon, 
    saveCoupon,
    handleBulkAction,
    onPageChange,
    onPageSizeChange,
  } = useCouponsData(); 

  const [showCouponModal, setShowCouponModal] = useState(false); 
  const [modalMode, setModalMode] = useState("create");
  const [selectedCoupon, setSelectedCoupon] = useState(null); 
  const [showQuickView, setShowQuickView] = useState(false);

  const handleCreateCoupon = () => {
    // Xử lý tạo Coupon
    setModalMode("create");
    setSelectedCoupon(null);
    setShowCouponModal(true);
  };

  const handleEditCoupon = (coupon) => {
    // Xử lý chỉnh sửa Coupon
    setModalMode("edit");
    setSelectedCoupon(coupon);
    setShowCouponModal(true);
  };

  const handleQuickView = (coupon) => {
    // Xử lý xem nhanh Coupon
    setSelectedCoupon(coupon);
    setShowQuickView(true);
  };

  const handleExportCSV = () => exportCouponsCSV(filters, sortConfig); // Xử lý xuất CSV

  return (
    <AdminLayout>
      <div className="overflow-auto px-8 py-6">
        <CouponsHeader // Component Header
          onCreateCoupon={handleCreateCoupon}
          onExportCSV={handleExportCSV}
        />

        <CouponsToolbar // Component Toolbar
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={() =>
            setFilters({ search: "", status: "", type: "" })
          } // Thêm type nếu cần filter
        />

        <CouponBulkActionsBar // Component Bulk Actions
          selectedCount={selectedItems.size}
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
          onBulkAction={handleBulkAction}
          show={selectedItems.size > 0}
        />

        <CouponsTable // Component Table
          coupons={coupons} // Dữ liệu coupons
          selectedItems={selectedItems}
          loading={loading}
          sortConfig={sortConfig}
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          onSelectItem={selectItem}
          onSort={updateSort}
          onQuickView={handleQuickView}
          onEditCoupon={(id) =>
            handleEditCoupon(coupons.find((c) => c.id === id))
          }
          onDeleteCoupon={deleteCoupon}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />

        {showCouponModal && ( // Modal tạo/chỉnh sửa Coupon
          <CouponModal
            mode={modalMode}
            coupon={selectedCoupon}
            onClose={() => setShowCouponModal(false)}
            onSave={async (data) => {
              await saveCoupon(data, modalMode, selectedCoupon);
              setShowCouponModal(false);
            }}
          />
        )}

        {showQuickView &&
          selectedCoupon && ( // Modal xem nhanh Coupon
            <CouponQuickViewModal
              coupon={selectedCoupon}
              onClose={() => setShowQuickView(false)}
              onEdit={() => {
                setShowQuickView(false);
                handleEditCoupon(selectedCoupon);
              }}
            />
          )}
      </div>
    </AdminLayout>
  );
}
