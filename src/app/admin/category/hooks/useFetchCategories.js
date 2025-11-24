"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useCategoryMutations } from "./useCategoryMutations";
import { useSelection } from "@/hooks/useSelection";
import categoryApi from "@/lib/api/categoryApi";

export function useFetchCategories(initialCategories = {}) {
  const { selectedItems, deselectAll, selectItem, selectAll } = useSelection({
    api: categoryApi,
  });

  const [categories, setCategories] = useState(initialCategories.data || []);
  const [totalItems, setTotalItems] = useState(
    initialCategories.pagination?.totalItems || 0
  );
  const [isLoading, setIsLoading] = useState(false);

  const fetchCategories = useCallback(
    async (params) => {
      setIsLoading(true);
      try {
        const res = await categoryApi.getCategories(params);

        setCategories(res.data);
        setTotalItems(res.pagination?.totalItems ?? res.data.length);

        deselectAll();
      } catch (err) {
        console.error("Fetch categories failed:", err);
        toast.error("Không thể tải danh sách danh mục.");
      } finally {
        setIsLoading(false);
      }
    },
    [deselectAll]
  );

  useEffect(() => {
    setCategories(initialCategories.data || []);
    setTotalItems(initialCategories.pagination?.totalItems || 0);
  }, [initialCategories]);

  const { isMutating, deleteCategory, saveCategory, handleBulkAction } =
    useCategoryMutations(fetchCategories, selectedItems, deselectAll);

  return {
    categories,
    totalItems,
    isLoading,

    selectedItems,
    selectItem,
    selectAll,
    deselectAll,

    deleteCategory,
    saveCategory,
    handleBulkAction,
  };
}
