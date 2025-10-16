/** Chuyển object -> querystring. Mảng sẽ join bằng dấu phẩy */
function toQueryString(obj = {}) {
  const p = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (v == null) return;
    if (Array.isArray(v)) {
      const cleaned = v.map(x => String(x ?? '').trim()).filter(Boolean);
      if (cleaned.length) p.set(k, cleaned.join(','));
    } else {
      const val = String(v).trim();
      if (val !== '') p.set(k, val);
    }
  });
  return p.toString();
}


