"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FilterSidebarSkeleton from "./FilterSidebarSkeleton";

/* ===========================
 * FAKE APIs (demo)
 * =========================== */
async function fetchFilterTemplateFake(categorySlug) {
  await new Promise((r) => setTimeout(r, 120));
  return {
    meta: {
      category_slug: categorySlug,
      title: "Bộ lọc",
      version: 2,
      locale: "vi-VN",
    },
    fields: {
      brand: {
        label: "Thương hiệu",
        control: "select",
        multi: true,
        facet: { type: "discrete" },
      },
      chipset: {
        label: "Chip xử lý",
        control: "select",
        multi: true,
        facet: { type: "discrete" },
      },
      screen_size_bucket: {
        label: "Kích thước màn hình",
        control: "bucket-select",
        multi: true,
        facet: {
          type: "range",
          path: "$.screen.size",
          buckets: [
            { id: "lt_6_1", label: '< 6.1"' },
            { id: "6_1_6_7", label: '6.1" - 6.7"' },
            { id: "gt_6_7", label: '> 6.7"' },
          ],
        },
      },
      battery_capacity_bucket: {
        label: "Dung lượng pin",
        control: "bucket-select",
        multi: true,
        facet: {
          type: "range",
          path: "$.battery.capacity",
          buckets: [
            { id: "lt_4000", label: "< 4000 mAh" },
            { id: "4k_5k", label: "4000 - 5000 mAh" },
            { id: "gt_5000", label: "> 5000 mAh" },
          ],
        },
      },
      waterproof: {
        label: "Chống nước",
        control: "select",
        datatype: "boolean",
        facet: { type: "discrete" },
        options: [
          { value: "true", label: "Có" },
          { value: "false", label: "Không" },
        ],
        include_all_option: true,
      },
      connectivity: {
        label: "Kết nối",
        control: "multiselect",
        facet: { type: "discrete" },
        options: ["5G", "Wi-Fi 6", "Wi-Fi 6E", "Bluetooth 5.3", "NFC"],
      },
      ram: {
        label: "RAM",
        control: "select",
        multi: true,
        facet: { type: "discrete" },
        options: ["4GB", "6GB", "8GB", "12GB", "16GB"],
      },
      storage: {
        label: "Dung lượng",
        control: "select",
        multi: true,
        facet: { type: "discrete" },
        options: ["64GB", "128GB", "256GB", "512GB", "1TB"],
      },
      color: {
        label: "Màu sắc",
        control: "select",
        multi: true,
        facet: { type: "discrete" },
      },
    },
  };
}

async function fetchFilterOptionsFake(categorySlug, fields) {
  await new Promise((r) => setTimeout(r, 120));
  const repo = {
    brand: [
      { value: "apple", label: "Apple" },
      { value: "samsung", label: "Samsung" },
      { value: "xiaomi", label: "Xiaomi" },
      { value: "oppo", label: "OPPO" },
      { value: "vivo", label: "Vivo" },
      { value: "realme", label: "Realme" },
    ],
    chipset: [
      { value: "A17 Pro", label: "A17 Pro" },
      { value: "Snapdragon 8 Gen 3", label: "Snapdragon 8 Gen 3" },
      { value: "Dimensity 9200+", label: "Dimensity 9200+" },
    ],
    color: [
      { value: "Black", label: "Đen" },
      { value: "Silver", label: "Bạc" },
      { value: "Blue", label: "Xanh" },
    ],
  };
  const out = {};
  for (const f of fields) out[f] = repo[f] ?? [];
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
    fetchFilterTemplateFake(categorySlug)
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

function useFilterOptions(categorySlug, tpl) {
  const [state, setState] = useState({
    optionsByField: {},
    loading: true,
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
  for (const [k, def] of Object.entries(tpl.fields)) {
    if (
      def.control === "bucket-select" ||
      def.control === "multiselect" ||
      (def.control === "select" && def.multi)
    ) {
      state[k] = [];
    } else if (def.datatype === "boolean" && def.control === "select") {
      state[k] = null;
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
  for (const [fieldKey, def] of Object.entries(tpl.fields)) {
    const raw = searchParams.get(fieldKey);
    if (raw == null || raw === "") continue;

    if (
      def.control === "bucket-select" ||
      def.control === "multiselect" ||
      (def.control === "select" && def.multi)
    ) {
      const incoming = raw
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
      const options =
        optionsByField?.[fieldKey] ||
        (Array.isArray(def.options)
          ? def.options.map((o) =>
              typeof o === "object"
                ? { value: String(o.value), label: String(o.label) }
                : { value: String(o), label: String(o) }
            )
          : []);
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
 * UI bits (đã style theo mock)
 * =========================== */
function CheckboxList({ items, checked, onToggle }) {
  return (
    <div className="space-y-2">
      {items.map((opt) => (
        <label
          key={opt.value}
          className="flex items-center text-[13px] leading-5"
        >
          <input
            type="checkbox"
            className="chk h-4 w-4 rounded-md border border-gray-300 mr-2 align-middle"
            checked={checked.includes(opt.value)}
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
    const s = new Set(arr || []);
    s.has(v) ? s.delete(v) : s.add(v);
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

  // bucket
  if (def.control === "bucket-select") {
    const buckets = def?.facet?.buckets || [];
    return (
      <section
        className={withDivider ? "pb-3 mb-3 border-b border-gray-100" : "mb-3"}
      >
        <h3 className="text-[13px] font-semibold mb-2">{def.label}</h3>
        <div className="space-y-2">
          {buckets.map((b) => (
            <label
              key={b.id}
              className="flex items-center text-[13px] leading-5"
            >
              <input
                type="checkbox"
                className="chk h-4 w-4 rounded-md border border-gray-300 mr-2"
                checked={(cur || []).includes(b.id)}
                onChange={() =>
                  setState((s) => ({
                    ...s,
                    [fieldKey]: toggleInArray(s[fieldKey] || [], b.id),
                  }))
                }
              />
              <span>{b.label}</span>
            </label>
          ))}
        </div>
      </section>
    );
  }

  // multi
  if (
    def.control === "multiselect" ||
    (def.control === "select" && def.multi)
  ) {
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

  const fieldKeys = Object.keys(tpl.fields);

  return (
    <aside
      className={["w-72 hidden lg:block", open ? "open block" : ""].join(" ")}
      id="filterSidebar"
    >
      {/* Card bao toàn bộ + ấn định chiều cao, ẩn tràn để scrollbar nằm trong bo góc */}
      <div className="filter-card rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.1)] overflow-hidden h-[calc(100vh-100px)]">
        {/* Vùng CUỘN: scrollbar ở trong border */}
        <div className="scroll-area h-full px-4 pt-4">
          <h2 className="text-sm font-semibold mb-3">{tpl.meta.title}</h2>

          {(loadingOpts || errorOpts) && (
            <div className="text-[12px] mb-2">
              {loadingOpts && <FilterSidebarSkeleton />}
              {errorOpts && (
                <span className="text-red-600">Lỗi tải options</span>
              )}
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
                const qs = query
                  ? query.startsWith("?")
                    ? query
                    : "?" + query
                  : "";
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
