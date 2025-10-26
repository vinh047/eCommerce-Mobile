
"use client";

import debounce from "lodash.debounce";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";


export function useUrlSync(tableState) {
    const router = useRouter();
    const pathname = usePathname();
    const skipNextEffect = useRef(false);

    const updateUrlParams = useCallback(() => {
        const params = new URLSearchParams();
        const { currentPage, pageSize, filters, sortConfig } = tableState;
        
        if (currentPage > 1) params.set("page", String(currentPage));
        if (pageSize !== 10) params.set("pageSize", String(pageSize));
        if (filters.search) params.set("search", filters.search.trim());
        // if (filters.status?.length > 0) params.set("status", filters.status.join(","));
        // Thêm các filters động khác vào đây
        
        params.set("sort", `${sortConfig.column}:${sortConfig.direction}`);
        console.log("Updating URL with params:", params.toString());
        skipNextEffect.current = true;
        router.replace(`${pathname}?${params.toString()}`);
    }, [tableState, pathname, router]);

    const debouncedUpdateUrl = useRef(debounce(updateUrlParams, 300)).current;

    // useEffect(() => {
    //     debouncedUpdateUrl();
    //     return () => debouncedUpdateUrl.cancel(); 
    // }, [tableState, debouncedUpdateUrl]);
    
    return { skipNextEffect };
}