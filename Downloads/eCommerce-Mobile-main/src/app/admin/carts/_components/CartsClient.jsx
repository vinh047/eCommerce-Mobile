"use client";

import { useState, lazy, Suspense } from "react";
import {
  CartsHeader,
  CartsToolbar,
  CartBulkActionsBar,
  CartsTable,
} from "./index";
import { useFetchCarts } from "../hooks/useFetchCarts";
import { useExportCartsCSV } from "../utils/exportCartsCSV";
import PageHeader from "@/components/common/PageHeader";
import TableSkeleton from "@/components/common/TableSkeleton";

const CartQuickViewModal = lazy(() => import("./CartQuickViewModal"));

export default function CartsClient({ initialCarts }) {
  const {
    carts,
    totalItems,

    selectedItems,
    selectItem,
    selectAll,
    deselectAll,

    deleteCart,
    handleBulkAction,
  } = useFetchCarts(initialCarts);

  const [selectedCart, setSelectedCart] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);

  const { exportCartsCSV } = useExportCartsCSV();

  const handleQuickView = async (cart) => {
    try {
      const res = await import("@/lib/api/cartsApi").then((mod) =>
        mod.default.getCartById(cart.id)
      );
      setSelectedCart(res);
      setShowQuickView(true);
    } catch (e) {
      console.error("Cannot fetch cart detail", e);
    }
  };

  return (
    <div className="overflow-auto px-8 py-6">
      {/* Tái sử dụng PageHeader hoặc dùng CartsHeader riêng */}
      <CartsHeader onExport={exportCartsCSV} />

      <CartsToolbar />

      <CartBulkActionsBar
        selectedCount={selectedItems.size}
        onSelectAll={selectAll}
        onDeselectAll={deselectAll}
        onBulkAction={handleBulkAction}
        show={selectedItems.size > 0}
      />

      <Suspense fallback={<TableSkeleton />}>
        <CartsTable
          carts={carts}
          selectedItems={selectedItems}
          totalItems={totalItems}
          onSelectItem={selectItem}
          onQuickView={handleQuickView}
          onDeleteCart={deleteCart}
        />
      </Suspense>

      {/* Modal Xem Nhanh */}
      {showQuickView && selectedCart && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
              Loading...
            </div>
          }
        >
          <CartQuickViewModal
            cart={selectedCart}
            onClose={() => setShowQuickView(false)}
          />
        </Suspense>
      )}
    </div>
  );
}
