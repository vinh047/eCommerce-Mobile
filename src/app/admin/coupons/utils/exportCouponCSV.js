import { exportToCSV } from "@/utils/exportCSV";
import couponsApi from "@/lib/api/couponsApi";
import { toast } from "sonner";

export async function exportCouponsCSV(filters, sortConfig) {
  try {
    const res = await couponsApi.getCoupons({
      search: filters.search || "",
      status: filters.status || "",
      type: filters.type || "",
      sortBy: sortConfig.column,
      sortOrder: sortConfig.direction,
    });

    const coupons = res.data;
    const headers = [
      "ID",
      "Code",
      "Type",
      "Value",
      "Min Order",
      "Starts At",
      "Ends At",
      "Usage Limit",
      "Used Count",
      "Status",
      "Category ID",
      "Brand ID",
    ];

    const mapRow = (coupon) => [
      coupon.id,
      coupon.code,
      coupon.type,
      coupon.value,
      coupon.minOrder,
      coupon.startsAt ? new Date(coupon.startsAt).toISOString() : "",
      coupon.endsAt ? new Date(coupon.endsAt).toISOString() : "",
      coupon.usageLimit || "",
      coupon.used,
      coupon.status,
      coupon.categoryId || "",
      coupon.brandId || "",
    ];

    await exportToCSV({
      data: coupons,
      headers,
      mapRow: (coupon) => [mapRow(coupon)],
      filename: "coupons_export",
    });
  } catch (err) {
    console.error("Export CSV failed:", err);
    toast.error("Không thể xuất CSV mã giảm giá.");
  }
}
