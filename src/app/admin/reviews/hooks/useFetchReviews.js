"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import reviewsApi from "@/lib/api/reviewsApi";
import { useReviewMutations } from "./useReviewMutations";
import { useSelection } from "@/hooks/useSelection";

export function useFetchReviews(initialData = {}) {
  const { selectedItems, deselectAll, selectItem, selectAll } = useSelection({
    api: reviewsApi,
  });

  const [reviews, setReviews] = useState(initialData.data || []);
  const [totalItems, setTotalItems] = useState(
    initialData.pagination?.totalItems || 0
  );
  const [isLoading, setIsLoading] = useState(false);

  const fetchReviews = useCallback(
    async (params) => {
      setIsLoading(true);
      try {
        const res = await reviewsApi.getReviews(params);
        setReviews(res.data);
        setTotalItems(res.pagination?.totalItems || 0);
        deselectAll();
      } catch (err) {
        console.error(err);
        toast.error("Lỗi tải danh sách đánh giá.");
      } finally {
        setIsLoading(false);
      }
    },
    [deselectAll]
  );

  useEffect(() => {
    setReviews(initialData.data || []);
    setTotalItems(initialData.pagination?.totalItems || 0);
  }, [initialData]);

  const { isMutating, deleteReview, saveReview, handleBulkAction } =
    useReviewMutations(fetchReviews, selectedItems, deselectAll);

  return {
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
    isMutating,
  };
}