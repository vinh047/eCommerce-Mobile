/**
 * Gọi API Route để lấy template filter cho một category.
 */
export async function fetchFilterTemplate(categoryId) {
  const res = await fetch(`/api/filters/category/${categoryId}`, {
    method: "GET",
    headers: { accept: "application/json" },
    cache: "force-cache",
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Fetch template failed (${res.status})`);
  }
  return res.json();
}

/**
 * Giả lập fetch options động.
 */
export async function fetchFilterOptionsFake(categoryId, fields) {
  await new Promise((r) => setTimeout(r, 30));
  const out = {};
  for (const f of fields) out[f] = [];
  return out;
}
