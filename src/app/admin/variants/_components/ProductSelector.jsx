import { Check, ImageIcon, Search, X } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

export default function ProductSelector({
  products,
  currentId,
  onSelect,
  onClose,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toString().includes(searchTerm)
    );
  }, [products, searchTerm]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative z-10 bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[80vh] animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="font-semibold text-lg dark:text-white">
            Chọn sản phẩm cha
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
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
              placeholder="Tìm theo tên hoặc ID sản phẩm..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-800 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {filteredProducts.length > 0 ? (
            <div className="space-y-1">
              {filteredProducts.map((product) => {
                const isSelected = product.id === currentId;
                return (
                  <div
                    key={product.id}
                    onClick={() => onSelect(product)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border ${
                      isSelected
                        ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                        : "border-transparent hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-md flex-shrink-0 flex items-center justify-center text-xs text-gray-500 overflow-hidden relative">
                      {product.image ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_URL_IMAGE}${product.image}`}
                          alt={product.name || "product image"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-5 h-5" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                          {product.name}
                        </span>
                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                          ID: {product.id}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex gap-2">
                        <span>Giá: {product.price?.toLocaleString()}₫</span>
                        <span>•</span>
                        <span>Tồn: {product.stock || 0}</span>
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              Không tìm thấy sản phẩm nào.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
