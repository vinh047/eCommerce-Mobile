// hooks/useSelection.js

import { useState, useCallback } from "react";
import { useQueryParams } from "./useQueryParams";

export function useSelection({ api }) {
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectAllForFilter, setSelectAllForFilter] = useState(false);

  const selectItem = useCallback((id, selected) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      selected ? newSet.add(id) : newSet.delete(id);
      return newSet;
    });
  }, []);

  const deselectAll = useCallback(() => {
    setSelectedItems(new Set());
    setSelectAllForFilter(false);
  }, []);

  const selectPage = useCallback((currentData, selected) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (selected) {
        currentData.forEach((item) => newSet.add(item.id));
      } else {
        currentData.forEach((item) => newSet.delete(item.id));
      }
      return newSet;
    });
  }, []);

  const selectAll = useCallback(
    async (currentData, selected) => {
      try {
        const all = location.href.split("/");
        const queryParams = all[all.length - 1];
        const res = await api.getAllIds(queryParams);
        setSelectedItems(new Set(res.ids));
        console.log("Select All IDs:", res.ids);
        setSelectAllForFilter(true);
      } catch {
        toast.error("Không thể chọn tất cả người dùng.");
      }
    },
    [api]
  );

  return {
    selectedItems,
    selectAllForFilter,
    selectItem,
    deselectAll,
    selectPage,
    selectAll,
    setSelectedItems,
    setSelectAllForFilter,
  };
}
