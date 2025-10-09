"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FilterSidebarSkeleton from "./FilterSidebarSkeleton";

/* ===========================
 * API thật + Adapter
 * =========================== */
async function fetchFilterTemplate(categorySlug) {
  const res = await fetch(`/api/products/categorySlug/${categorySlug}`, {
    method: "GET",
    headers: { accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Fetch template failed (${res.status})`);
  const json = await res.json(); // { data: { meta, fields } }

  return json.data.data;
}

/** Chuẩn hoá payload BE -> FE (đảm bảo title + ép id/value sang string) */
function adaptBackendTemplateToFE(be) {
  const out = { meta: { ...be.meta }, fields: {} };

  // đảm bảo có title để hiển thị
  out.meta.title = be?.meta?.category?.name || "Bộ lọc";

  for (const [k, def] of Object.entries(be.fields || {})) {
    const control = def.control; // "bucket-select" | "select" | "multiselect"
    if (control === "bucket-select") {
      out.fields[k] = {
        ...def,
        facet: {
          ...def.facet,
          buckets: (def.facet?.buckets ?? []).map((b) => ({
            id: String(b.id), // ép string để so sánh checkbox/URL
            label: b.label,
            count: b.count ?? undefined,
          })),
        },
      };
    } else if (control === "select" || control === "multiselect") {
      out.fields[k] = {
        ...def,
        options: (def.options ?? []).map((o) =>
          typeof o === "object" && o !== null
            ? { value: String(o.value), label: String(o.label) }
            : { value: String(o), label: String(o) }
        ),
      };
    } else {
      out.fields[k] = def;
    }
  }

  return out;
}

/* ===========================
 * Hooks
 * =========================== */
function useFilterTemplate(categorySlug) {
  const [state, setState] = useState({ tpl: null, loading: true, error: null });
  useEffect(() => {
    let ignore = false;
    setState({ tpl: null, loading: true, error: null });
    fetchFilterTemplate(categorySlug)
      .then((be) => adaptBackendTemplateToFE(be))
      .then((tpl) => !ignore && setState({ tpl, loading: false, error: null }))
      .catch(
        (err) => !ignore && setState({ tpl: null, loading: false, error: err })
      );
    return () => {
      ignore = true;
    };
  }, [categorySlug]);
  return state;
}

/** Nếu có field select/multiselect mà options rỗng và cần fetch thêm, bạn có thể dùng hook này.
 *  Với payload BE hiện tại, đa số field đã có options nên hook sẽ không gọi thêm gì. */
async function fetchFilterOptionsFake(categorySlug, fields) {
  // giữ nguyên cấu trúc, nhưng hầu như không dùng trong case hiện tại
  await new Promise((r) => setTimeout(r, 30));
  const out = {};
  for (const f of fields) out[f] = [];
  return out;
}

function useFilterOptions(categorySlug, tpl) {
  const [state, setState] = useState({
    optionsByField: {},
    loading: false,
    error: null,
  });
  useEffect(() => {
    if (!tpl) return;
    let ignore = false;
    const dynamicFields = Object.entries(tpl.fields)
      .filter(
        ([, def]) =>
          (def.control === "select" || def.control === "multiselect") &&
          !Array.isArray(def.options)
      )
      .map(([k]) => k);

    if (!dynamicFields.length) {
      setState({ optionsByField: {}, loading: false, error: null });
      return;
    }

    setState((s) => ({ ...s, loading: true }));
    fetchFilterOptionsFake(categorySlug, dynamicFields)
      .then(
        (opts) =>
          !ignore &&
          setState({ optionsByField: opts, loading: false, error: null })
      )
      .catch(
        (err) =>
          !ignore &&
          setState({ optionsByField: {}, loading: false, error: err })
      );

    return () => {
      ignore = true;
    };
  }, [categorySlug, tpl]);
  return state;
}

/* ===========================
 * Helpers
 * =========================== */
function buildInitialStateFromTemplate(tpl) {
  const state = {};
  for (const [k, def] of Object.entries(tpl.fields || {})) {
    if (
      def.control === "bucket-select" ||
      def.control === "multiselect" ||
      (def.control === "select" && def.multi)
    ) {
      state[k] = [];
    } else if (def.datatype === "boolean" && def.control === "select") {
      state[k] = null; // 3 trạng thái: null/"true"/"false"
    } else if (def.control === "select") {
      state[k] = "";
    } else {
      state[k] = undefined;
    }
  }
  return state;
}

// không bao giờ tạo key=rỗng, chỉ thêm page/pageSize khi có filter
function buildQueryFromState(state) {
  const params = new URLSearchParams();
  let hasFilter = false;

  const add = (k, v) => {
    if (v === null || v === undefined) return;
    const s = String(v).trim();
    if (!s) return;
    params.set(k, s);
  };

  Object.entries(state).forEach(([k, v]) => {
    if (Array.isArray(v)) {
      const cleaned = v.map((x) => String(x ?? "").trim()).filter(Boolean);
      if (cleaned.length) {
        add(k, cleaned.join(","));
        hasFilter = true;
      }
    } else if (v !== null && v !== undefined && String(v).trim() !== "") {
      add(k, v);
      hasFilter = true;
    }
  });

  if (hasFilter) {
    params.set("page", "1");
    params.set("pageSize", "24");
  }
  return params.toString(); // "" nếu không có gì
}

function normalizeValuesToOptions(values, options) {
  if (!Array.isArray(values) || !values.length) return [];
  if (!Array.isArray(options) || !options.length) return values;
  const map = new Map(
    options.map((o) => [String(o.value).toLowerCase(), String(o.value)])
  );
  return values
    .map((v) => map.get(String(v).toLowerCase()) || String(v))
    .filter(Boolean);
}

function readFiltersFromSearch(tpl, searchParams, optionsByField) {
  const out = buildInitialStateFromTemplate(tpl);
  for (const [fieldKey, def] of Object.entries(tpl.fields || {})) {
    const raw = searchParams.get(fieldKey);
    if (raw == null || raw === "") continue;

    // multi
    if (
      def.control === "bucket-select" ||
      def.control === "multiselect" ||
      (def.control === "select" && def.multi)
    ) {
      const incoming = raw
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);

      // bucket-select không có options -> dùng buckets làm options
      const options =
        optionsByField?.[fieldKey] ||
        (Array.isArray(def.options)
          ? def.options.map((o) =>
              typeof o === "object"
                ? { value: String(o.value), label: String(o.label) }
                : { value: String(o), label: String(o) }
            )
          : (def.facet?.buckets || []).map((b) => ({
              value: String(b.id),
              label: b.label,
            })));

      out[fieldKey] = normalizeValuesToOptions(incoming, options);
      continue;
    }

    if (def.datatype === "boolean" && def.control === "select") {
      const v = raw.toLowerCase();
      out[fieldKey] = v === "true" ? "true" : v === "false" ? "false" : null;
      continue;
    }

    out[fieldKey] = raw;
  }
  return out;
}

/* ===========================
 * UI bits
 * =========================== */
function CheckboxList({ items, checked, onToggle }) {
  return (
    <div className="space-y-2">
      {items.map((opt) => (
        <label key={opt.value} className="flex items-center text-[13px] leading-5">
          <input
            type="checkbox"
            className="chk h-4 w-4 rounded-md border border-gray-300 mr-2 align-middle"
            checked={(checked || []).map(String).includes(String(opt.value))}
            onChange={() => onToggle(opt.value)}
          />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

function FieldRenderer({
  fieldKey,
  def,
  state,
  setState,
  optionsByField,
  withDivider,
}) {
  const cur = state[fieldKey];
  const toggleInArray = (arr, v) => {
    const s = new Set((arr || []).map(String));
    const sv = String(v);
    s.has(sv) ? s.delete(sv) : s.add(sv);
    return Array.from(s);
  };

  const options =
    optionsByField[fieldKey] ||
    (Array.isArray(def.options)
      ? def.options.map((o) =>
          typeof o === "object" && o !== null
            ? { value: String(o.value), label: String(o.label) }
            : { value: String(o), label: String(o) }
        )
      : []) ||
    [];

  // bucket-select
  if (def.control === "bucket-select") {
    const buckets = (def?.facet?.buckets || []).map((b) => ({
      value: String(b.id),
      label: b.label,
    }));
    return (
      <section
        className={withDivider ? "pb-3 mb-3 border-b border-gray-100" : "mb-3"}
      >
        <h3 className="text-[13px] font-semibold mb-2">{def.label}</h3>
        <CheckboxList
          items={buckets}
          checked={cur || []}
          onToggle={(v) =>
            setState((s) => ({
              ...s,
              [fieldKey]: toggleInArray(s[fieldKey] || [], v),
            }))
          }
        />
      </section>
    );
  }

  // multiselect / select multi
  if (def.control === "multiselect" || (def.control === "select" && def.multi)) {
    return (
      <section
        className={withDivider ? "pb-3 mb-3 border-b border-gray-100" : "mb-3"}
      >
        <h3 className="text-[13px] font-semibold mb-2">{def.label}</h3>
        <CheckboxList
          items={options}
          checked={cur || []}
          onToggle={(v) =>
            setState((s) => ({
              ...s,
              [fieldKey]: toggleInArray(s[fieldKey] || [], v),
            }))
          }
        />
      </section>
    );
  }

  // boolean tri-state
  if (def.datatype === "boolean" && def.control === "select") {
    const tri = [{ value: "", label: "Tất cả" }, ...(def.options || [])];
    return (
      <section
        className={withDivider ? "pb-3 mb-3 border-b border-gray-100" : "mb-3"}
      >
        <h3 className="text-[13px] font-semibold mb-2">{def.label}</h3>
        <select
          className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={cur ?? ""}
          onChange={(e) =>
            setState((s) => ({ ...s, [fieldKey]: e.target.value || null }))
          }
        >
          {tri.map((o) => (
            <option key={String(o.value)} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </section>
    );
  }

  // single select
  if (def.control === "select") {
    return (
      <section
        className={withDivider ? "pb-3 mb-3 border-b border-gray-100" : "mb-3"}
      >
        <h3 className="text-[13px] font-semibold mb-2">{def.label}</h3>
        <select
          className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={cur || ""}
          onChange={(e) =>
            setState((s) => ({ ...s, [fieldKey]: e.target.value || "" }))
          }
        >
          <option value="">-- Chọn --</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </section>
    );
  }

  return null;
}

/* ===========================
 * COMPONENT CHÍNH
 * =========================== */
export default function FilterSidebar({ categorySlug, open = false }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    tpl,
    loading: loadingTpl,
    error: errorTpl,
  } = useFilterTemplate(categorySlug);
  const {
    optionsByField,
    loading: loadingOpts,
    error: errorOpts,
  } = useFilterOptions(categorySlug, tpl);

  const initialFilterState = useMemo(
    () => (tpl ? buildInitialStateFromTemplate(tpl) : {}),
    [tpl]
  );
  const [filters, setFilters] = useState({});

  // hydrate từ URL (và khi options load xong)
  useEffect(() => {
    if (!tpl) return;
    const next = readFiltersFromSearch(tpl, searchParams, optionsByField);
    const hasAny = Object.values(next).some((v) =>
      Array.isArray(v) ? v.length : v !== "" && v !== null && v !== undefined
    );
    setFilters(hasAny ? next : initialFilterState);
  }, [tpl, searchParams, optionsByField, initialFilterState]);

  const query = useMemo(() => buildQueryFromState(filters), [filters]);

  if (loadingTpl) return <FilterSidebarSkeleton />;
  if (errorTpl || !tpl)
    return (
      <aside className="w-72 pr-2 text-[13px] text-red-600">
        Không tải được template.
      </aside>
    );

  const fieldKeys = Object.keys(tpl.fields || {});

  return (
    <aside
      className={["w-72 hidden lg:block", open ? "open block" : ""].join(" ")}
      id="filterSidebar"
    >
      {/* Card bao toàn bộ + ấn định chiều cao, ẩn tràn để scrollbar nằm trong bo góc */}
      <div className="filter-card rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.1)] overflow-hidden h-[calc(100vh-100px)]">
        {/* Vùng CUỘN: scrollbar ở trong border */}
        <div className="scroll-area h-full px-4 pt-4">

          {(loadingOpts || errorOpts) && (
            <div className="text-[12px] mb-2">
              {loadingOpts && <FilterSidebarSkeleton />}
              {errorOpts && <span className="text-red-600">Lỗi tải options</span>}
            </div>
          )}

          {fieldKeys.map((fieldKey, idx) => (
            <FieldRenderer
              key={fieldKey}
              fieldKey={fieldKey}
              def={tpl.fields[fieldKey]}
              state={filters}
              setState={setFilters}
              optionsByField={optionsByField}
              withDivider={idx !== fieldKeys.length - 1}
            />
          ))}

          {/* debug nhỏ trong vùng cuộn */}
          <div className="mt-3 text-[12px] text-gray-500 break-all pb-24">
            <div className="font-medium mb-1">Query:</div>
            {query || "(trống)"}
          </div>
        </div>

        {/* Action bar KHÔNG cuộn, dính trong card ở đáy */}
        <div className="action-bar border-t bg-white px-4 py-3">
          <div className="flex gap-2">
            <button
              className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="button"
              onClick={() => {
                const qs = query ? (query.startsWith("?") ? query : "?" + query) : "";
                const url = `/products/${categorySlug}${qs}`;
                router.push(url);
              }}
            >
              Áp dụng
            </button>
            <button
              className="flex-1 bg-gray-100 text-gray-800 py-2 px-3 rounded-lg hover:bg-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-300"
              type="button"
              onClick={() => setFilters(initialFilterState)}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
