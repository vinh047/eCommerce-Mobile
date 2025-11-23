"use client";

import { useState, lazy, Suspense } from "react";
import ReviewsHeader from "./ReviewsHeader";
import ReviewsToolbar from "./ReviewsToolbar";
import ReviewsTable from "./ReviewsTable";
import { useFetchReviews } from "../hooks/useFetchReviews";
import TableSkeleton from "@/components/common/TableSkeleton";
import { UserBulkActionsBar } from "../../users/_components";

const ReviewsModal = lazy(() => import("./ReviewsModal"));
const ReviewsQuickViewModal = lazy(() => import("./ReviewsQuickViewModal"));

export default function ReviewsClient({ initialData }) {
  const {
    reviews,
    totalItems,
    isLoading,
    selectedItems,
    selectItem,
    selectAll,
    deselectAll,
    deleteReview,
    saveReview,
    handleBulkAction,
  } = useFetchReviews(initialData);

  const [showModal, setShowModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);

  // Review chỉ có Edit (Moderation), ko có Create
  const handleEdit = (review) => {
    setSelectedReview(review);
    setShowModal(true);
  };

  const handleQuickView = (review) => {
    setSelectedReview(review);
    setShowQuickView(true);
  };

  return (
    <div className="overflow-auto px-8 py-6">
      <ReviewsHeader />
      <ReviewsToolbar />

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
          <ReviewsTable
            reviews={reviews}
            selectedItems={selectedItems}
            totalItems={totalItems}
            onSelectItem={selectItem}
            onQuickView={handleQuickView}
            onEdit={handleEdit}
            onDelete={deleteReview}
          />
        )}
      </div>

      {showModal && selectedReview && (
        <Suspense fallback={<div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">Loading...</div>}>
          <ReviewsModal
            review={selectedReview}
            onClose={() => setShowModal(false)}
            onSave={async (data) => {
              await saveReview(data, "edit", selectedReview);
              setShowModal(false);
            }}
          />
        </Suspense>
      )}

      {showQuickView && selectedReview && (
        <Suspense fallback={null}>
          <ReviewsQuickViewModal
            review={selectedReview}
            onClose={() => setShowQuickView(false)}
            onEdit={() => {
              setShowQuickView(false);
              handleEdit(selectedReview);
            }}
          />
        </Suspense>
      )}
    </div>
  );
}