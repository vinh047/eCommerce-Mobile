"use client";

import { useState, lazy, Suspense } from "react";
import OrdersHeader from "./OrdersHeader";
import OrdersToolbar from "./OrdersToolbar";
import OrdersTable from "./OrdersTable";
import { useFetchOrders } from "../hooks/useFetchOrders";
import { UserBulkActionsBar } from "../../users/_components";
import TableSkeleton from "@/components/common/TableSkeleton";
import { useAuth } from "@/contexts/AuthContext";
import { PERMISSION_KEYS } from "../../constants/permissions";

const OrdersModal = lazy(() => import("./OrdersModal"));
const OrdersQuickViewModal = lazy(() => import("./OrdersQuickViewModal"));

export default function OrdersClient({ initialData }) {
  const {
    orders,
    totalItems,
    isLoading,
    selectedItems,
    selectItem,
    selectAll,
    deselectAll,
    deleteOrder,
    saveOrder,
    handleBulkAction,
  } = useFetchOrders(initialData);

  // UI States
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);

  const handleCreate = () => {
    setModalMode("create");
    setSelectedOrder(null);
    setShowModal(true);
  };

  const handleEdit = (order) => {
    setModalMode("edit");
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleQuickView = (order) => {
    setSelectedOrder(order);
    setShowQuickView(true);
  };

  const { hasPermission } = useAuth();

  if (!hasPermission(PERMISSION_KEYS.VIEW_ORDER)) {
    return (
      <div className="p-6 text-red-600">
        Bạn không có quyền truy cập trang này
      </div>
    );
  }

  return (
    <div className="overflow-auto px-8 py-6">
      <OrdersHeader onCreate={handleCreate} />

      <OrdersToolbar />

      {/* Hiển thị BulkActions nếu có import được hoặc component có sẵn */}
      {/* Nếu UserBulkActionsBar bị lỗi import, bạn có thể tạm comment dòng này */}
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
          <OrdersTable
            orders={orders}
            selectedItems={selectedItems}
            totalItems={totalItems}
            onSelectItem={selectItem}
            onQuickView={handleQuickView}
            onEdit={handleEdit}
            onDelete={deleteOrder}
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
          <OrdersModal
            mode={modalMode}
            order={selectedOrder}
            onClose={() => setShowModal(false)}
            onSave={async (data) => {
              await saveOrder(data, modalMode, selectedOrder);
              setShowModal(false);
            }}
          />
        </Suspense>
      )}

      {showQuickView && selectedOrder && (
        <Suspense fallback={null}>
          <OrdersQuickViewModal
            order={selectedOrder}
            onClose={() => setShowQuickView(false)}
            onEdit={() => {
              setShowQuickView(false);
              handleEdit(selectedOrder);
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
