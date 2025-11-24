import { apiFetch } from "./utils/apiFetch";

/**
 * Create a new coupon (POST /api/coupons)
 */
export async function createCoupon(payload) {
  const res = await apiFetch(`/api/coupons`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res;
}

/**
 * Get coupons list (GET /api/coupons)
 */
export async function getCoupons(opts = {}) {
  const params = new URLSearchParams();

  if (opts.page) params.set("page", String(opts.page));
  if (opts.pageSize) params.set("pageSize", String(opts.pageSize));
  if (opts.search) params.set("search", opts.search);
  if (opts.status) params.set("status", Array.isArray(opts.status) ? opts.status.join(",") : opts.status);
  if (opts.type) params.set("type", Array.isArray(opts.type) ? opts.type.join(",") : opts.type);
  if (opts.sortBy) params.set("sortBy", opts.sortBy);
  if (opts.sortOrder) params.set("sortOrder", opts.sortOrder);
  if (opts.code) params.set("code", opts.code);
  if (opts.suggest) params.set("suggest", "1");
  if (opts.activeOnly) params.set("activeOnly", "1");
  if (opts.categoryId) params.set("categoryId", String(opts.categoryId));
  if (opts.brandId) params.set("brandId", String(opts.brandId));
  if (opts.subtotal !== undefined) params.set("subtotal", String(opts.subtotal));
  if (opts.items) {
    try {
      params.set("items", encodeURIComponent(JSON.stringify(opts.items)));
    } catch (e) {
      // ignore invalid items
    }
  }

  const qs = params.toString();
  const url = `/coupons${qs ? `?${qs}` : ""}`;

  const res = await apiFetch(url, { method: "GET" });
  return res;
}

/**
 * Validate a coupon using POST /api/coupons/validate
 * @param {string} code
 * @param {Object} opts - { items: [{price,quantity,categoryId?,brandId?}], subtotal }
 * @returns { ok: boolean, coupon, eligibleAmount, computedDiscount, reason, raw }
 */
export async function validateCoupon(code, opts = {}) {
  if (!code) return { ok: false, error: "Missing code", coupon: null, raw: null };

  const body = {
    code: String(code).trim(),
  };
  if (opts.items) body.items = opts.items;
  if (opts.subtotal !== undefined) body.subtotal = Number(opts.subtotal);

  try {
    const res = await apiFetch("/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    // apiFetch expected to return parsed JSON or throw on non-2xx
    // normalize response to { ok, coupon, eligibleAmount, computedDiscount, reason, raw }
    const raw = res;
    const ok = !!raw?.ok;
    const coupon = raw?.coupon ?? null;
    const eligibleAmount = raw?.eligibleAmount ?? 0;
    const computedDiscount = raw?.computedDiscount ?? 0;
    const reason = raw?.couponInvalidReason ?? raw?.error ?? null;

    console.log("res: ", res)

    return { ok, coupon, eligibleAmount, computedDiscount, reason, raw };
  } catch (err) {
    // apiFetch may throw on network / non-2xx
    return { ok: false, error: err?.message || "Validation failed", coupon: null, raw: err };
  }
}

/**
 * Convenience: apply coupon on checkout server-side.
 * Caller should include couponCode in checkoutPayload.
 */
export async function applyCouponOnCheckout(checkoutPayload) {
  const res = await apiFetch(`/checkout/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(checkoutPayload),
    credentials: "include",
  });
  return res;
}
