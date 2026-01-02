// components/Cart/CartItem.jsx
import { Trash2, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/utils/format";
import { Button } from "../ui/form/Button";

export default function CartItem({
  item,
  isSelected,
  onToggleSelect,
  onUpdateQuantity,
  onRemove,
}) {
  return (
    <div
      className="group relative bg-white rounded-xl p-4 border border-gray-100 shadow-sm transition-all hover:shadow-md"
      data-item-id={item.id}
    >
      <div className="flex gap-4">
        {/* Checkbox */}
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            checked={isSelected || false}
            onChange={onToggleSelect}
            className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
          />
        </div>

        {/* Ảnh sản phẩm */}
        <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
          <img
            src={`/assets/products/${item.image}`}
            alt={item.name}
            className="w-full h-full object-contain mix-blend-multiply"
          />
        </div>

        {/* Thông tin chi tiết */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start gap-2">
              <h3 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2">
                <Link
                  href={`/san-pham/${item.slug}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {item.name}
                </Link>
              </h3>
              
              {/* Nút xoá desktop - Dùng Button ghost */}
              <div className="hidden sm:block">
                <Button
                  ghost
                  size="xs"
                  iconOnly
                  className="text-gray-400! hover:text-red-600! hover:bg-red-50!"
                  onClick={() => onRemove(item.id)}
                  aria-label="Xóa sản phẩm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Phân loại hàng */}
            <p className="mt-1 text-xs sm:text-sm text-gray-500 bg-gray-50 inline-block px-2 py-1 rounded">
              {[item.variantName, ...(item.specs || [])].join(" • ")}
            </p>
          </div>

          <div className="mt-3 flex items-end justify-between gap-2">
            {/* Giá tiền */}
            <div className="flex flex-col">
              <span className="text-blue-600 font-bold text-base sm:text-lg">
                {formatPrice(item.price)}
              </span>
            </div>

            {/* Bộ điều khiển số lượng dùng Button Custom */}
            <div className="flex items-center gap-1.5">
              <Button
                outline
                size="xs"
                iconOnly
                className="w-8 h-8 rounded-lg !border-gray-200"
                onClick={() => onUpdateQuantity(item.id, -1)}
                disabled={item.quantity <= 1}
              >
                <Minus className="w-3.5 h-3.5" />
              </Button>
              
              <span className="min-w-[2rem] text-center text-sm font-medium text-gray-900">
                {item.quantity}
              </span>
              
              <Button
                outline
                size="xs"
                iconOnly
                className="w-8 h-8 rounded-lg !border-gray-200"
                onClick={() => onUpdateQuantity(item.id, 1)}
                disabled={item.quantity >= (item.maxStock || 99)}
              >
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Nút xoá mobile (absolute top right) */}
      <div className="sm:hidden absolute top-2 right-2">
        <Button
          ghost
          size="xs"
          iconOnly
          className="text-gray-300 hover:text-red-500"
          onClick={() => onRemove(item.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}