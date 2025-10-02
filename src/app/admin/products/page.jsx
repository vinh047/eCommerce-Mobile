"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/Layout/AdminLayout";
import ProductsHeader from "@/components/Products/ProductsHeader";
import ProductsToolbar from "@/components/Products/ProductsToolbar";
import ProductsTable from "@/components/Products/ProductsTable";
import ProductModal from "@/components/Products/ProductModal";
import QuickViewModal from "@/components/Products/QuickViewModal";
import BulkActionsBar from "@/components/Products/BulkActionsBar";
import ToastContainer from "@/components/ui/ToastContainer";
import { useProducts } from "@/hooks/useProducts";
import { useToast } from "@/hooks/useToast";

export default function ProductsPage() {
  const {
    products,
    selectedItems,
    currentPage,
    pageSize,
    totalItems,
    loading,
    filters,
    sortConfig,
    selectItem,
    selectAll,
    deselectAll,
    updateFilters,
    updateSort,
    changePage,
    changePageSize,
    bulkAction,
    deleteProduct,
    refreshProducts,
  } = useProducts();

  const { showToast } = useToast();

  const [showProductModal, setShowProductModal] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit'

  const handleCreateProduct = () => {
    setModalMode("create");
    setSelectedProduct(null);
    setShowProductModal(true);
  };

  const handleEditProduct = (productId) => {
    const product = products.find((p) => p.id === productId);
    setModalMode("edit");
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleQuickView = (productId) => {
    const product = products.find((p) => p.id === productId);
    setSelectedProduct(product);
    setShowQuickView(true);
  };

  const handleDeleteProduct = (productId) => {
    if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      deleteProduct(productId);
      showToast("Đã xóa sản phẩm thành công", "success");
    }
  };

  const handleBulkAction = (action) => {
    if (selectedItems.size === 0) {
      showToast("Vui lòng chọn ít nhất một sản phẩm", "warning");
      return;
    }

    switch (action) {
      case "activate":
        bulkAction("activate", Array.from(selectedItems));
        showToast(`Đã hiển thị ${selectedItems.size} sản phẩm`, "success");
        break;
      case "deactivate":
        bulkAction("deactivate", Array.from(selectedItems));
        showToast(`Đã ẩn ${selectedItems.size} sản phẩm`, "success");
        break;
      case "delete":
        if (confirm(`Bạn có chắc muốn xóa ${selectedItems.size} sản phẩm?`)) {
          bulkAction("delete", Array.from(selectedItems));
          showToast(`Đã xóa ${selectedItems.size} sản phẩm`, "success");
        }
        break;
      default:
        showToast("Tính năng đang được phát triển", "info");
    }
  };

  const handleExportCSV = () => {
    showToast("Đang xuất file CSV...", "info");
    setTimeout(() => {
      showToast("Đã xuất file CSV thành công", "success");
    }, 2000);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
            Dashboard
          </a>
          <i className="fas fa-chevron-right text-xs"></i>
          <span className="text-gray-900 dark:text-white font-medium">
            Sản phẩm
          </span>
        </nav>

        {/* Page Header */}
        <ProductsHeader
          onCreateProduct={handleCreateProduct}
          onExportCSV={handleExportCSV}
        />

        {/* Toolbar */}
        <ProductsToolbar
          filters={filters}
          onFiltersChange={updateFilters}
          onClearFilters={() => {
            updateFilters({});
            showToast("Đã xóa tất cả bộ lọc", "success");
          }}
        />

        {/* Bulk Actions Bar */}
        <BulkActionsBar
          selectedCount={selectedItems.size}
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
          onBulkAction={handleBulkAction}
          show={selectedItems.size > 0}
        />

        {/* Products Table */}
        <ProductsTable
          products={products}
          selectedItems={selectedItems}
          loading={loading}
          sortConfig={sortConfig}
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          onSelectItem={selectItem}
          onSelectAll={selectAll}
          onSort={updateSort}
          onQuickView={handleQuickView}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
          onPageChange={changePage}
          onPageSizeChange={changePageSize}
        />

        {/* Modals */}
        {showProductModal && (
          <ProductModal
            mode={modalMode}
            product={selectedProduct}
            onClose={() => setShowProductModal(false)}
            onSave={(data) => {
              // Handle save logic
              setShowProductModal(false);
              showToast(
                modalMode === "create"
                  ? "Đã tạo sản phẩm thành công"
                  : "Đã cập nhật sản phẩm thành công",
                "success"
              );
            }}
          />
        )}

        {showQuickView && selectedProduct && (
          <QuickViewModal
            product={selectedProduct}
            onClose={() => setShowQuickView(false)}
            onEdit={() => {
              setShowQuickView(false);
              handleEditProduct(selectedProduct.id);
            }}
            onDuplicate={() => {
              setShowQuickView(false);
              showToast("Đã nhân bản sản phẩm", "success");
            }}
          />
        )}

        {/* Toast Container */}
        <ToastContainer />
      </div>
    </AdminLayout>
  );
}
