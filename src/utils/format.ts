export function formatPrice(value: number, locale = "vi-VN", currency = "VND") {
  if (typeof value !== "number") return "";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0, // bỏ phần thập phân
  }).format(value);
}
