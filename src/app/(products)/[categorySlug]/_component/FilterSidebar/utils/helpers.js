/**
 * Chuyển đổi template từ BE sang cấu trúc dữ liệu cho FE.
 */
export function adaptBackendTemplateToFE(be) {
  if (!be || !Array.isArray(be.fields)) {
    return { meta: { title: "Bộ lọc" }, fields: {}, rawFields: [] };
  }

  const out = {
    meta: {
      title: be.name || "Bộ lọc",
      categoryId: be.categoryId,
      categorySlug: be.categorySlug,
    },
    fields: {},
    rawFields: [],
  };

  for (const def of be.fields) {
    const effectiveControl =
      def.control || (def.type === "brand" ? "multiselect" : "select");

    // 🛑 BƯỚC 1: LỌC BỎ CÁC CONTROL KHÔNG CẦN THIẾT
    if (
      effectiveControl !== "select" &&
      effectiveControl !== "multiselect" &&
      effectiveControl !== "bucket-select"
    ) {
      continue;
    }

    const fieldKey = def.code;
    let adaptedField = { ...def, control: effectiveControl };

    // 🔥 LOGIC ĐÃ SỬA: Kiểm tra nếu là range (valueType) bất kể là product hay variant type
    let isRangeOrBucket =
      def.control === "bucket-select" || def.valueType === "range";

    // 🛑 BƯỚC 2: ƯU TIÊN BUCKETS (RANGE)
    if (
      isRangeOrBucket &&
      Array.isArray(def.buckets) &&
      def.buckets.length > 0
    ) {
      // range -> bucket-select (ưu tiên 1)
      adaptedField = {
        ...adaptedField,
        facet: {
          buckets: (def.buckets ?? []).map((b) => ({
            id: String(b.id),
            label: b.label,
            count: b.count ?? undefined,
          })),
        },
        control: "bucket-select", // Ép control thành bucket-select cho UI
      };
    }
    // 🛑 BƯỚC 3: DÙNG OPTIONS
    else if (Array.isArray(def.options) && def.options.length > 0) {
      adaptedField = {
        ...adaptedField,
        options: (def.options ?? []).map((o) =>
          typeof o === "object" && o !== null
            ? {
                value: String(o.slug || o.value || o.id),
                label: String(o.label || o.name),
              }
            : { value: String(o), label: String(o) }
        ),
      };
    } else {
      // Field không có cả buckets và options, bỏ qua
      continue;
    }

    // 🛑 BƯỚC 4: THÊM VÀO KẾT QUẢ
    out.fields[fieldKey] = adaptedField;
    out.rawFields.push(fieldKey); // Lưu thứ tự hiển thị
  }

  return out;
}

/**
 * Tạo state ban đầu từ template.
 */
export function buildInitialStateFromTemplate(tpl) {
  const state = {};
  for (const [k, def] of Object.entries(tpl.fields || {})) {
    if (
      def.control === "bucket-select" ||
      def.control === "multiselect" ||
      (def.control === "select" && def.multi) || // Thêm multi-select
      def.type === "brand" // Brand luôn là multi-select
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

/**
 * Tạo chuỗi query string từ state filter.
 */
export function buildQueryFromState(state) {
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
  return params.toString();
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

/**
 * Đọc giá trị filter từ URL search params.
 */
export function readFiltersFromSearch(tpl, searchParams, optionsByField) {
  const out = buildInitialStateFromTemplate(tpl);
  for (const [fieldKey, def] of Object.entries(tpl.fields || {})) {
    const raw = searchParams.get(fieldKey);
    if (raw == null || raw === "") continue;

    // multi (bao gồm Brand)
    if (
      def.control === "bucket-select" ||
      def.control === "multiselect" ||
      def.type === "brand" ||
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
                ? {
                    value: String(o.value || o.slug),
                    label: String(o.label || o.name),
                  }
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

/**
 * Thêm/xóa một giá trị trong mảng.
 */
export const toggleInArray = (arr, v) => {
  const s = new Set((arr || []).map(String));
  const sv = String(v);
  s.has(sv) ? s.delete(sv) : s.add(sv);
  return Array.from(s);
};
