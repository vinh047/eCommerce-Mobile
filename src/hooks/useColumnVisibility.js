import { useState } from "react";

export function useColumnVisibility(defaultColumns) {
  const [columnVisibility, setColumnVisibility] = useState(defaultColumns);
  const [showColumnFilter, setShowColumnFilter] = useState(false);

  const toggleColumnFilter = () => setShowColumnFilter((prev) => !prev);

  const handleColumnVisibilityChange = (column, visible) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [column]: visible,
    }));
  };

  return {
    columnVisibility,
    showColumnFilter,
    toggleColumnFilter,
    handleColumnVisibilityChange,
  };
}
