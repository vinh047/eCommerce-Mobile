"use client";

import { Check, ImageIcon, Search, X, Box } from "lucide-react";
// Đã loại bỏ import Image từ "next/image" để tránh lỗi build trong môi trường preview
import { useMemo, useState } from "react";

export default function VariantSelector({
  variants = [], // Danh sách variants (đã include product & MediaVariant)
  currentId,
  onSelect,
  onClose,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  // Logic lọc variants
  const filteredVariants = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return variants.filter((v) => {
      const productName = v.product?.name?.toLowerCase() || "";
      const color = v.color?.toLowerCase() || "";
      const id = v.id.toString();

      // Tìm theo: Tên sản phẩm, Màu sắc, hoặc ID biến thể
      return (
        productName.includes(term) || 
        color.includes(term) || 
        id.includes(term)
      );
    });
  }, [variants, searchTerm]);

  const getVariantImage = (variant) => {
    // 1. Lấy ảnh trực tiếp của variant
    if (variant.MediaVariant && variant.MediaVariant.length > 0) {
      // Giả sử structure trả về có trường url
      return variant.MediaVariant[0].url; 
    }
    // 2. Fallback
    return null;
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative z-10 bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[80vh] animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="font-semibold text-lg dark:text-white flex items-center gap-2">
            <Box className="w-5 h-5 text-blue-500" />
            Chọn phân loại hàng
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full cursor-pointer transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên sản phẩm, màu sắc hoặc ID..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-800 dark:text-white transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {filteredVariants.length > 0 ? (
            <div className="space-y-1">
              {filteredVariants.map((variant) => {
                const isSelected = variant.id === currentId;
                const imageUrl = getVariantImage(variant);
                const productName = variant.product?.name || "Sản phẩm không tên";

                return (
                  <div
                    key={variant.id}
                    onClick={() => onSelect(variant)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border group ${
                      isSelected
                        ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                        : "border-transparent hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    {/* Image Thumbnail */}
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-md flex-shrink-0 flex items-center justify-center text-xs text-gray-500 overflow-hidden relative border border-gray-200 dark:border-gray-600">
                      {imageUrl ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_URL_IMAGE}${imageUrl}`}
                          alt={productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-gray-400" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate pr-2">
                          {productName}
                        </span>
                        <span className="flex-shrink-0 text-[10px] font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                          #{variant.id}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1">
                        {/* Màu sắc Badge */}
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {variant.color}
                        </span>

                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 ml-auto">
                           <span>{Number(variant.price).toLocaleString()}₫</span>
                           <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                           <span className={variant.stock <= (variant.lowStockThreshold || 5) ? "text-red-500 font-medium" : ""}>
                             Tồn: {variant.stock}
                           </span>
                        </div>
                      </div>
                    </div>

                    {/* Checkmark */}
                    <div className={`w-5 flex justify-center ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`}>
                       <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
              <Search className="w-10 h-10 mb-3 opacity-20" />
              <p>Không tìm thấy phân loại nào phù hợp.</p>
            </div>
          )}
        </div>
        
        {/* Footer Hint (Optional) */}
        <div className="p-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-xs text-center text-gray-500">
           Hiển thị {filteredVariants.length} kết quả
        </div>
      </div>
    </div>
  );
}