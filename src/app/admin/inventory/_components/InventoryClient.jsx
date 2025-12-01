"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import PageHeader from "@/components/common/PageHeader";
import TableSkeleton from "@/components/common/TableSkeleton";
import InventoryHeader from "./InventoryHeader";
import InventoryToolbar from "./InventoryToolbar";
import InventoryTable from "./InventoryTable";
import { useFetchInventory } from "../hooks/useFetchInventory";

// Lazy load Modals
const CreateTransactionModal = lazy(() => import("./CreateTransactionModal"));
const TransactionDetailModal = lazy(() => import("./TransactionDetailModal"));

export default function InventoryClient({ initialTransactions , initialVariants}) {
  // 1. Hooks quản lý dữ liệu
  const { transactions, totalItems, createTransaction } =
    useFetchInventory(initialTransactions);

  // 2. UI State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [transactionType, setTransactionType] = useState("in");
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Handlers
  const handleOpenCreate = (type) => {
    setTransactionType(type);
    setShowCreateModal(true);
  };

  const handleSaveTransaction = async (formData) => {
    await createTransaction(formData, () => {
      setShowCreateModal(false);
    });
  };

  const handleViewDetail = (txn) => {
    setSelectedTransaction(txn);
  };

  return (
    <div className="overflow-auto px-8 py-6">
      {/* Header riêng của Inventory có 2 nút Nhập/Xuất */}
      <InventoryHeader onCreateTransaction={handleOpenCreate} />

      <InventoryToolbar />

      <Suspense fallback={<TableSkeleton />}>
        <InventoryTable
          transactions={transactions}
          totalItems={totalItems}
          onViewDetail={handleViewDetail}
        />
      </Suspense>

      {/* Modal Tạo Phiếu */}
      {showCreateModal && (
        <Suspense fallback={<div>Loading...</div>}>
          <CreateTransactionModal
            type={transactionType}
            variants={initialVariants.data}
            onClose={() => setShowCreateModal(false)}
            onSave={handleSaveTransaction}
          />
        </Suspense>
      )}

      {/* Modal Xem Chi Tiết */}
      {selectedTransaction && (
        <Suspense fallback={<div>Loading detail...</div>}>
          <TransactionDetailModal
            ticket={selectedTransaction}
            onClose={() => setSelectedTransaction(null)}
          />
        </Suspense>
      )}
    </div>
  );
}
