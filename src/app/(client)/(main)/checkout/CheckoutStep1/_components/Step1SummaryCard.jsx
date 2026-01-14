import { Button } from "@/components/ui/form/Button";
import { formatCurrency } from "../utils/utils";

export default function Step1SummaryCard({
  items,
  total,
  shippingFee,
  estimatingShipping,
  showReviewItems,
  onToggleReviewItems,
  onContinue,
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="text-sm text-gray-700">Tổng tiền tạm tính</div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-red-600">
              {formatCurrency(total)}
            </span>
            <div className="text-sm text-gray-500 mt-1">
              {estimatingShipping
                ? "Đang ước tính phí vận chuyển…"
                : `Phí vận chuyển hiện tại: ${formatCurrency(shippingFee)}`}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button size="sm" outline onClick={onToggleReviewItems}>
            {showReviewItems ? "Ẩn kiểm tra sản phẩm" : "Kiểm tra lại sản phẩm"}
          </Button>
          <Button primary size="md" onClick={onContinue}>
            Tiếp tục
          </Button>
        </div>
      </div>

      {showReviewItems && items && items.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Sản phẩm trong đơn
          </h3>
          <div className="space-y-3">
            {items.map((it) => (
              <div
                key={it.id || `${it.variantId}-${it.name}`}
                className="flex items-center gap-4 p-3 rounded-md border bg-gray-50"
              >
                <div className="w-16 h-16 bg-white rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {it.image ? (
                    <img
                      src={`/assets/products/${it.image}`}
                      alt={it.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-xs">No image</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {it.name} {it.variantName ? `— ${it.variantName}` : ""}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {[...(it.specs || [])].join(" • ")}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-700">
                    Số lượng: <span className="font-medium">{it.quantity}</span>
                  </div>
                  <div className="text-sm text-gray-900 font-bold mt-1">
                    {formatCurrency(it.price)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
