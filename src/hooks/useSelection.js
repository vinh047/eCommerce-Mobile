// hooks/useSelection.js 

import { useState, useCallback } from "react";

export function useSelection() {
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
                currentData.forEach(item => newSet.add(item.id));
            } else {
                currentData.forEach(item => newSet.delete(item.id));
            }
            return newSet;
        });
    }, []);
    
    return {
        selectedItems,
        selectAllForFilter,
        selectItem,
        deselectAll,
        selectPage, 
        setSelectedItems,
        setSelectAllForFilter,
    };
}