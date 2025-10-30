"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import FilterSidebarSkeleton from "./FilterSidebarSkeleton";
import FilterField from "./FilterField";
import FilterActionBar from "./FilterActionBar";
import { useFilterData } from "./hooks/useFilterData";
import { buildQueryFromState } from "./utils/helpers";

export default function FilterSidebar({ category, open = false }) {
  const router = useRouter();
  const {
    tpl,
    loading,
    error,
    filters,
    setFilters,
    optionsByField,
    initialFilterState,
  } = useFilterData(category.id);

  const query = useMemo(() => buildQueryFromState(filters), [filters]);

  const handleApply = () => {
    const qs = query ? `?${query}` : "";
    const slug = category.slug;
    router.push(`/${slug}${qs}`);
  };

  const handleReset = () => {
    const slug = category.slug;
    router.push(`/${slug}`)
    setFilters(initialFilterState);
  };

  if (loading) return <FilterSidebarSkeleton />;
  if (error || !tpl) {
    return (
      <aside className="w-72 pr-2 text-red-600">Không tải được bộ lọc.</aside>
    );
  }

  const fieldKeys = tpl.rawFields || Object.keys(tpl.fields || {});

  return (
    <aside
      className={["w-72 hidden lg:block", open ? "open block" : ""].join(" ")}
      id="filterSidebar"
    >
      <div className="filter-card rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.15)] overflow-hidden h-[calc(100vh-100px)] pe-0.5">
        <div className="scroll-area h-full px-4 pt-4">
          {fieldKeys.map((fieldKey, idx) => (
            <FilterField
              key={fieldKey}
              fieldKey={fieldKey}
              def={tpl.fields[fieldKey]}
              state={filters}
              setState={setFilters}
              optionsByField={optionsByField}
              withDivider={idx !== fieldKeys.length - 1}
            />
          ))}
        </div>

        <FilterActionBar onApply={handleApply} onReset={handleReset} />
      </div>
    </aside>
  );
}
