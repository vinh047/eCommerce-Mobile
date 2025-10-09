// utils/api.js
function serializeQuery(params = {}) {
  const sp = new URLSearchParams();
  for (const [key, val] of Object.entries(params)) {
    if (val == null) continue;
    if (Array.isArray(val)) {
      const arr = val.map(String).map(s => s.trim()).filter(Boolean);
      if (arr.length) sp.set(key, arr.join(","));
    } else {
      sp.set(key, String(val).trim());
    }
  }
  return sp.toString();
}

function toQueryString(input) {
  if (!input) return "";
  if (typeof input === "string") {
    // input có thể là "?a=1&b=2" hoặc "a=1&b=2"
    return input.startsWith("?") ? input.slice(1) : input;
  }
  if (input instanceof URLSearchParams) return input.toString();
  // object
  return serializeQuery(input);
}

/**
 * Gọi /api/products — FE truyền NGUYÊN query (string/URLSearchParams/object đều ok)
 * @param {Object|URLSearchParams|string} filtersOrQs
 * @param {Object} options
 */
export async function getProducts(filtersOrQs = {}, options = {}) {
  const {
    baseUrl = "/api/products",
    headers = {},
    signal,
    timeout = 10000,
  } = options;

  const origin =
    typeof window === "undefined"
      ? (process.env.NEXT_PUBLIC_API_ORIGIN || "http://localhost:3000")
      : window.location.origin;

  const url = new URL(baseUrl, origin);
  const qs = toQueryString(filtersOrQs);
  if (qs) url.search = qs;

  const controller = new AbortController();
  const to = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { Accept: "application/json", ...headers },
      signal: signal ?? controller.signal,
    });
    clearTimeout(to);

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(payload?.error || `Request failed: ${res.status}`);
    return payload.data; // { items, page, pageSize, total, totalPages }
  } catch (err) {
    clearTimeout(to);
    throw err;
  }
}
