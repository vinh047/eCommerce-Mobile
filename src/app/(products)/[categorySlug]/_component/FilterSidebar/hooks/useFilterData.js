import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { fetchFilterTemplate } from "@/lib/api/filter";
import {
    adaptBackendTemplateToFE,
    buildInitialStateFromTemplate,
    readFiltersFromSearch
} from "../utils/helpers";

export function useFilterData(categoryId) {
    const searchParams = useSearchParams();
    const [tpl, setTpl] = useState(null);
    const [optionsByField, setOptionsByField] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});

    // Effect 1: Fetch template và chuẩn hóa
    useEffect(() => {
        if (!categoryId) return;
        setLoading(true);
        fetchFilterTemplate(categoryId)
            .then(be => be ? adaptBackendTemplateToFE(be) : null)
            .then(feTpl => {
                setTpl(feTpl);
                if (!feTpl) setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, [categoryId]);

    // Effect 2: Fetch options động khi đã có template
    useEffect(() => {
        if (!tpl) return;

        const dynamicFields = Object.entries(tpl.fields)
            .filter(([, def]) => (def.control === "select" || def.control === "multiselect") && !Array.isArray(def.options))
            .map(([k]) => k);

        if (!dynamicFields.length) {
            setLoading(false); // Hoàn tất loading
            return;
        }

        fetchFilterOptionsFake(categoryId, dynamicFields)
            .then(opts => {
                setOptionsByField(opts);
            })
            .catch(err => {
                setError(err); // Có thể set lỗi riêng cho options
            })
            .finally(() => {
                setLoading(false); // Hoàn tất loading
            });
    }, [categoryId, tpl]);

    // Effect 3: Khởi tạo và cập nhật state `filters` từ URL
    useEffect(() => {
        if (!tpl) return;
        const initialState = buildInitialStateFromTemplate(tpl);
        const stateFromSearch = readFiltersFromSearch(tpl, searchParams, optionsByField);
        
        const hasAnyValue = Object.values(stateFromSearch).some(
            (v) => (Array.isArray(v) ? v.length > 0 : v !== "" && v !== null)
        );

        setFilters(hasAnyValue ? stateFromSearch : initialState);
    }, [tpl, searchParams, optionsByField]);

    const initialFilterState = useMemo(
        () => (tpl ? buildInitialStateFromTemplate(tpl) : {}),
        [tpl]
    );

    return {
        tpl,
        optionsByField,
        loading,
        error,
        filters,
        setFilters,
        initialFilterState,
    };
}
