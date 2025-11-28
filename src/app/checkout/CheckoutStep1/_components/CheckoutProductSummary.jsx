import { Button } from "@/components/ui/form/Button";

export default function CheckoutProductSummary({
  items,
  firstItem,
  otherItems,
  showOthers,
  onToggleOthers,
}) {
  if (!firstItem) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sản phẩm</h2>
        <div className="text-gray-600">Không có sản phẩm</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Sản phẩm</h2>

      {/* Sản phẩm đầu tiên */}
      <div className="flex items-start gap-4 border-b border-gray-200 pb-4">
        <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
          {firstItem.image ? (
            <img
              src={`/assets/products/${firstItem.image}`}
              alt={firstItem.name}
              className="w-20 h-20 object-cover"
            />
          ) : (
            <div className="text-gray-400 text-xs">No image</div>
          )}
        </div>
        <div className="flex-1">
          <div className="font-medium text-gray-900">
            <a href={`/product/${firstItem.slug}`} className="hover:underline">
              {firstItem.name}
            </a>{" "}
            {[firstItem.variantName || "", ...(firstItem.specs || [])]
              .filter(Boolean)
              .join(" - ")}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-lg font-bold text-red-600">
              {formatCurrency(firstItem.price)}
            </span>
            <span className="text-sm text-gray-600">
              Số lượng: {firstItem.quantity}
            </span>
          </div>
        </div>
      </div>

      {/* Thông tin thêm / nút hiển thị các SP còn lại */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {otherItems.length > 0
            ? `và ${otherItems.length} sản phẩm khác`
            : "Chỉ 1 sản phẩm trong giỏ hàng"}
        </div>
        {otherItems.length > 0 && (
          <Button size="sm" outline onClick={onToggleOthers}>
            {showOthers ? "Thu gọn" : "Hiện thêm"}
          </Button>
        )}
      </div>

      {/* Danh sách sản phẩm còn lại */}
      {showOthers && otherItems.length > 0 && (
        <div className="mt-4 space-y-3 border-t pt-4">
          {otherItems.map((it) => (
            <div
              key={it.id || `${it.variantId}-${it.name}`}
              className="flex items-start gap-3"
            >
              <div className="w-14 h-14 bg-gray-50 rounded-md flex items-center justify-center overflow-hidden">
                {it.image ? (
                  <img
                    src={`/assets/products/${it.image}`}
                    alt={it.name}
                    className="w-14 h-14 object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-xs">No image</div>
                )}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  <a href={`/product/${it.slug}`} className="hover:underline">
                    {it.name}
                  </a>{" "}
                  {[it.variantName || "", ...(it.specs || [])]
                    .filter(Boolean)
                    .join(" - ")}
                </div>
                <div className="text-sm text-gray-600">
                  Số lượng: {it.quantity} • {formatCurrency(it.price)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(Number(value || 0));
