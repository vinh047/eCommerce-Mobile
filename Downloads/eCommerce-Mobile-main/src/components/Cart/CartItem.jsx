export default function CartItem({
  item,
  isSelected,
  onToggleSelect,
  onUpdateQuantity,
  onRemove,
}) {
  return (
    <div
      className="cart-item bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-100"
      data-item-id={item.id}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox chọn */}
        <div className="flex items-center justify-center mt-6">
          <input
            type="checkbox"
            checked={isSelected || false}
            onChange={onToggleSelect}
            className="w-5 h-5 accent-blue-600 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out cursor-pointer"
            aria-label={`Chọn ${item.name}`}
          />
        </div>

        {/* Nội dung sản phẩm */}
        <div className="flex items-start gap-4 flex-1">
          {/* Hình ảnh */}
          <div className="flex-shrink-0">
            <img
              src={`/assets/products/${item.image}`}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-lg border border-gray-200"
            />
          </div>

          {/* Thông tin */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-base">
              <a href={`/product/${item.slug}`} className="hover:underline">
                {item.name}
              </a>
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              {[item.variantName, ...(item.specs || [])].join(" - ")}
            </p>

            {/* Giá + số lượng + nút xoá */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="font-bold text-blue-600 text-lg">
                  {formatPrice(item.price)}
                </span>

                {/* Stepper số lượng */}
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    className="px-3 py-2 hover:bg-gray-50 focus:outline-none cursor-pointer"
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    disabled={item.quantity <= 1}
                  >
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <span className="px-4 py-2 text-sm font-medium text-gray-700">
                    {item.quantity}
                  </span>
                  <button
                    className="px-3 py-2 hover:bg-gray-50 focus:outline-none cursor-pointer"
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    disabled={item.quantity >= item.maxStock}
                  >
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v12m6-6H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Nút xoá */}
              <button
                className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                onClick={() => onRemove(item.id)}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7m5 4v6m4-6v6M9 4h6a1 1 0 011 1v2H8V5a1 1 0 011-1z"
                  />
                </svg>
              </button>
            </div>

            {/* Thành tiền */}
            <div className="mt-3 text-sm">
              <span className="text-gray-500">Thành tiền: </span>
              <span className="font-semibold text-gray-900">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(price);
}
