"use client";

import { useState, useMemo } from "react";
import {
  X,
  Box,
  DollarSign,
  Image as ImageIcon,
  Search,
  Check,
  ChevronRight,
  Plus,
  Trash2,
  Star,
} from "lucide-react";
import Image from "next/image";

// --- COMPONENT SELECTOR (GIỮ NGUYÊN) ---
function ProductSelector({ products, currentId, onSelect, onClose }) {
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

// --- COMPONENT CHÍNH (VARIANT MODAL) ---
export default function VariantModal({
  mode,
  variant,
  allProducts = [],
  onClose,
  onSave,
}) {
  const [activeTab, setActiveTab] = useState("basic");
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState("");

  const [formData, setFormData] = useState({
    productId: variant?.productId || "",
    color: variant?.color || "",
    price: variant?.price || 0,
    compareAtPrice: variant?.compareAtPrice || 0,
    stock: variant?.stock || 0,
    lowStockThreshold: variant?.lowStockThreshold || 5,
    isActive: variant?.isActive ?? true,
    MediaVariant: variant?.MediaVariant || [],
  });

  const selectedProduct = allProducts.find((p) => p.id === formData.productId);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectProduct = (product) => {
    handleInputChange("productId", product.id);
    setShowProductSelector(false);
  };

  // --- LOGIC XỬ LÝ ẢNH (FIXED) ---
  const handleAddImage = () => {
    if (!tempImageUrl.trim()) return;

    // Nếu chưa có ảnh nào, ảnh này sẽ là Primary
    const isFirstImage = formData.MediaVariant.length === 0;

    // Tạo đúng cấu trúc object MediaVariant (có media nested bên trong)
    const newImage = {
      media: { url: tempImageUrl.trim() },
      isPrimary: isFirstImage,
    };

    setFormData((prev) => ({
      ...prev,
      MediaVariant: [...prev.MediaVariant, newImage],
    }));

    setTempImageUrl("");
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => {
      const newImages = prev.MediaVariant.filter(
        (_, index) => index !== indexToRemove
      );

      // Nếu xóa mất ảnh Primary, set ảnh đầu tiên còn lại làm Primary
      const wasPrimary = prev.MediaVariant[indexToRemove].isPrimary;
      if (wasPrimary && newImages.length > 0) {
        newImages[0].isPrimary = true;
      }

      return { ...prev, MediaVariant: newImages };
    });
  };

  const handleSetPrimary = (indexToSet) => {
    setFormData((prev) => ({
      ...prev,
      MediaVariant: prev.MediaVariant.map((item, index) => ({
        ...item,
        Media: {
          ...item.Media, //
          isPrimary: index === indexToSet,
        },
      })),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const tabs = [
    { id: "basic", name: "Thông tin cơ bản", icon: Box },
    { id: "pricing", name: "Giá & Tồn kho", icon: DollarSign },
    { id: "media", name: "Thư viện ảnh", icon: ImageIcon },
  ];

  const ModalTitle =
    mode === "create"
      ? "Thêm biến thể mới"
      : `Chỉnh sửa biến thể #${variant?.id}`;

  // --- RENDER TABS ---
  const renderBasicTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Sản phẩm cha *
        </label>
        <div
          onClick={() => setShowProductSelector(true)}
          className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors flex justify-between items-center group"
        >
          {selectedProduct ? (
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold px-1.5 py-0.5 rounded">
                #{selectedProduct.id}
              </div>
              <span className="text-gray-900 dark:text-white text-sm font-medium">
                {selectedProduct.name}
              </span>
            </div>
          ) : (
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              -- Nhấn để tìm và chọn sản phẩm --
            </span>
          )}
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
        </div>
        {/* Hidden input for validation */}
        <input
          type="number"
          required
          value={formData.productId}
          onChange={() => {}}
          className="sr-only"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Màu sắc (Tên hoặc Mã màu) *
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={formData.color}
            onChange={(e) => handleInputChange("color", e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ví dụ: Red, #FF0000"
            required
          />
          <div
            className="w-10 h-10 rounded border border-gray-300 shadow-sm"
            style={{ backgroundColor: formData.color || "#ffffff" }}
          ></div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Trạng thái
        </label>
        <select
          value={formData.isActive}
          onChange={(e) =>
            handleInputChange("isActive", e.target.value === "true")
          }
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="true">Đang bán</option>
          <option value="false">Ẩn</option>
        </select>
      </div>
    </div>
  );

  const renderPricingTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Giá bán *
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) =>
              handleInputChange("price", parseFloat(e.target.value) || 0)
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            required
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Giá gốc
          </label>
          <input
            type="number"
            value={formData.compareAtPrice}
            onChange={(e) =>
              handleInputChange(
                "compareAtPrice",
                parseFloat(e.target.value) || 0
              )
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            min="0"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Số lượng tồn kho
          </label>
          <input
            type="number"
            value={formData.stock}
            onChange={(e) =>
              handleInputChange("stock", parseInt(e.target.value) || 0)
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ngưỡng báo hết hàng
          </label>
          <input
            type="number"
            value={formData.lowStockThreshold}
            onChange={(e) =>
              handleInputChange(
                "lowStockThreshold",
                parseInt(e.target.value) || 0
              )
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            min="0"
          />
        </div>
      </div>
    </div>
  );

  const renderMediaTab = () => (
    <div className="space-y-6">
      {/* Input thêm ảnh */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Thêm URL Hình ảnh
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            value={tempImageUrl}
            onChange={(e) => setTempImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddImage();
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddImage}
            disabled={!tempImageUrl}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" /> Thêm
          </button>
        </div>
      </div>

      {/* Grid hiển thị danh sách ảnh */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Danh sách ảnh ({formData.MediaVariant.length})
        </label>

        {formData.MediaVariant.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {formData.MediaVariant.map((item, index) => (
              <div
                key={index}
                className={`group relative border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 aspect-square transition-all ${
                  item.isPrimary
                    ? "border-blue-500 ring-2 ring-blue-500/20 shadow-md"
                    : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                }`}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_URL_IMAGE}${
                    item.Media?.url || ""
                  }`}
                  alt={"product image"}
                  fill
                  className="object-cover"
                />

                {/* --- CÁC NÚT ĐIỀU KHIỂN --- */}
                {/* Nút Xóa */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 text-red-500 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 shadow-sm border border-gray-200 dark:border-gray-600"
                  title="Xóa ảnh này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Nút Set Primary */}
                <button
                  type="button"
                  onClick={() => handleSetPrimary(index)}
                  className={`absolute top-2 left-2 p-1.5 rounded-full shadow-sm border transition-all ${
                    item.Media.isPrimary
                      ? "bg-blue-600 text-white border-blue-600 opacity-100"
                      : "bg-white/90 dark:bg-gray-800/90 text-gray-400 border-gray-200 dark:border-gray-600 opacity-0 group-hover:opacity-100 hover:text-yellow-500"
                  }`}
                  title={
                    item.Media.isPrimary
                      ? "Đây là ảnh chính"
                      : "Đặt làm ảnh chính"
                  }
                >
                  <Star
                    className={`w-4 h-4 ${
                      item.Media.isPrimary ? "fill-current" : ""
                    }`}
                  />
                </button>

                {/* Badge hiển thị rõ nếu là Primary */}
                {item.Media.isPrimary && (
                  <div className="absolute bottom-0 inset-x-0 bg-blue-600 text-white text-[10px] text-center py-1 font-semibold uppercase tracking-wider">
                    Ảnh đại diện
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
            <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Chưa có hình ảnh nào</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 text-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          ></div>

          <div className="relative z-10 bg-white dark:bg-gray-800 rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:max-w-3xl w-full flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {ModalTitle}
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 px-6">
              <nav className="flex space-x-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      type="button"
                      className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                        activeTab === tab.id
                          ? "border-blue-600 text-blue-600 dark:text-blue-400"
                          : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
                      }`}
                    >
                      <Icon className="w-4 h-4" /> {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <div className="px-6 py-6 overflow-y-auto flex-1 custom-scrollbar">
                {activeTab === "basic" && renderBasicTab()}
                {activeTab === "pricing" && renderPricingTab()}
                {activeTab === "media" && renderMediaTab()}
              </div>

              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end space-x-3 bg-gray-50 dark:bg-gray-800/50">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm font-medium"
                >
                  Lưu biến thể
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showProductSelector && (
        <ProductSelector
          products={allProducts}
          currentId={formData.productId}
          onSelect={handleSelectProduct}
          onClose={() => setShowProductSelector(false)}
        />
      )}
    </>
  );
}
