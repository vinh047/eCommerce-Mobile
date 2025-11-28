"use client";

import { X, Box, DollarSign, Package, Activity, Copy, Edit } from "lucide-react";

export default function VariantQuickViewModal({ variant, onClose, onEdit }) {
  const formatCurrency = (val) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val || 0);
  const formatDate = (val) => new Date(val).toLocaleDateString("vi-VN");

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div className="absolute top-0 right-0 h-full w-full max-w-xl bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <Box className="w-5 h-5 mr-2 text-blue-500" /> Chi tiết Biến thể
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 h-full overflow-y-auto pb-24 space-y-8">
          {/* Header Info */}
          <div className="flex space-x-6">
            <div className="w-32 h-32 bg-gray-100 rounded-lg flex-shrink-0 border flex items-center justify-center overflow-hidden">
              {variant.MediaVariant?.[0]?.Media?.url ? (
                <img src={variant.MediaVariant[0].Media.url} alt="Variant" className="w-full h-full object-cover" />
              ) : (
                <Box className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{variant.product?.name}</h3>
              <p className="text-gray-500">Màu sắc: <span className="font-medium text-gray-800 dark:text-gray-200">{variant.color}</span></p>
              <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                SKU: {variant.id}
              </div>
            </div>
          </div>

          {/* Pricing & Stock Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center text-green-700 mb-2"><DollarSign className="w-4 h-4 mr-1"/> Giá bán</div>
              <div className="text-2xl font-bold text-green-800 dark:text-green-300">{formatCurrency(variant.price)}</div>
              {variant.compareAtPrice && <div className="text-sm line-through text-gray-500">{formatCurrency(variant.compareAtPrice)}</div>}
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center text-blue-700 mb-2"><Package className="w-4 h-4 mr-1"/> Tồn kho</div>
              <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">{variant.stock}</div>
              <div className="text-xs text-gray-500">Ngưỡng thấp: {variant.lowStockThreshold}</div>
            </div>
          </div>

          {/* Specifications (Dynamic List) */}
          {variant.variantSpecValues && variant.variantSpecValues.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <Activity className="w-4 h-4 mr-2" /> Thông số kỹ thuật
              </h4>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                {variant.variantSpecValues.map((spec, idx) => (
                  <div key={idx} className="flex justify-between text-sm border-b border-gray-200 last:border-0 pb-2 last:pb-0">
                    <span className="text-gray-500">{spec.spec?.label || "Thuộc tính"}:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-white dark:bg-gray-800 flex justify-end space-x-3">
          <button className="px-4 py-2 border rounded-lg flex items-center hover:bg-gray-50"><Copy className="w-4 h-4 mr-2"/> Sao chép</button>
          <button onClick={onEdit} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700"><Edit className="w-4 h-4 mr-2"/> Chỉnh sửa</button>
        </div>
      </div>
    </div>
  );
}