import { useMemo, useState } from "react";
import { Button } from "@/components/ui/form/Button";
import { formatCurrency } from "../../CheckoutStep1/utils/utils";

export default function CouponBox({
  appliedCoupon,     // coupon đang được áp dụng
  allCoupons = [],   // tất cả coupon hợp lệ backend trả về
  onSelectCoupon,    // user chọn 1 coupon khác
  onRemoveCoupon,    // user bỏ coupon
}) {
  const [showMore, setShowMore] = useState(false);

  // Tách coupon đang áp dụng ra khỏi danh sách allCoupons
  const otherCoupons = useMemo(() => {
    if (!appliedCoupon) return allCoupons;
    return allCoupons.filter(
      (c) => c.id !== appliedCoupon.id && c.code !== appliedCoupon.code
    );
  }, [allCoupons, appliedCoupon]);

  const hasOtherCoupons = otherCoupons.length > 0;

  return (
    <div className="pt-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium text-gray-700">
          Mã giảm giá
        </label>

        {hasOtherCoupons && (
          <button
            type="button"
            className="text-xs text-blue-600 hover:underline"
            onClick={() => setShowMore((v) => !v)}
          >
            {showMore
              ? "Ẩn bớt mã khác"
              : `Xem thêm mã khác (${otherCoupons.length})`}
          </button>
        )}
      </div>

      {/* Coupon đang áp dụng */}
      {appliedCoupon ? (
        <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded p-2 flex items-start justify-between gap-2">
          <div>
            <div className="font-semibold">
              Đang áp dụng: {appliedCoupon.code}
            </div>
            <div className="text-xs text-green-800 mt-0.5">
              Tiết kiệm{" "}
              <strong>
                {formatCurrency(
                  Number(
                    appliedCoupon.discountAmount ??
                      appliedCoupon.computedDiscount ??
                      0
                  )
                )}
              </strong>
            </div>
          </div>

          <Button
            size="xs"
            ghost
            className="!px-2 !py-1 text-red-600"
            onClick={onRemoveCoupon}
          >
            Bỏ
          </Button>
        </div>
      ) : (
        <div className="text-sm text-gray-500">
          Hiện chưa áp dụng mã giảm giá nào.
        </div>
      )}

      {/* Các mã khác */}
      {showMore && hasOtherCoupons && (
        <div className="mt-3 space-y-2">
          {otherCoupons.map((coupon) => (
            <button
              key={coupon.id ?? coupon.code}
              type="button"
              onClick={() => {
                onSelectCoupon(coupon);
                setShowMore(false);
              }}
              className="w-full text-left text-sm border rounded-lg px-3 py-2 hover:border-blue-400 hover:bg-blue-50 transition flex items-center justify-between"
            >
              <div>
                <div className="font-medium text-gray-900">
                  {coupon.code}
                </div>
                <div className="text-xs text-gray-600">
                  Tiết kiệm{" "}
                  <strong>
                    {formatCurrency(
                      Number(
                        coupon.discountAmount ??
                          coupon.computedDiscount ??
                          0
                      )
                    )}
                  </strong>
                </div>
              </div>
              <span className="text-xs text-blue-600 font-medium">
                Chọn
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
