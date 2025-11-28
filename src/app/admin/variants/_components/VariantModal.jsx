"use client";

import { useState, useEffect } from "react";
import {
  X,
  Box,
  DollarSign,
  Image as ImageIcon,
  ChevronRight,
  Plus,
  Trash2,
  Star,
  Settings,
  List,
} from "lucide-react";
import Image from "next/image";
import variantsApi from "@/lib/api/variantsApi";
import ProductSelector from "./ProductSelector";

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

  const [allSpecs, setAllSpecs] = useState([]);
  const [formData, setFormData] = useState({
    productId: variant?.productId || "",
    color: variant?.color || "",
    price: variant?.price || 0,
    compareAtPrice: variant?.compareAtPrice || 0,
    stock: variant?.stock || 0,
    lowStockThreshold: variant?.lowStockThreshold || 5,
    isActive: variant?.isActive ?? true,
    MediaVariant: variant?.MediaVariant || [],
    variantSpecValues: variant?.variantSpecValues || [],
  });

  const selectedProduct = allProducts.find((p) => p.id === formData.productId);
  useEffect(() => {
    const fetchSpecs = async () => {
      try {
        const res = await variantsApi.getVariantByTemplateId(variant.productId);
        if (res) {
          setAllSpecs(res);
        } else {
          setAllSpecs([]);
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách specs:", error);
      }
    };

    fetchSpecs();
  }, [selectedProduct]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectProduct = (product) => {
    handleInputChange("productId", product.id);
    setShowProductSelector(false);
  };

  const handleAddImage = () => {
    if (!tempImageUrl.trim()) return;
    const isFirstImage = formData.MediaVariant.length === 0;
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
        Media: { ...item.Media, isPrimary: index === indexToSet },
        isPrimary: index === indexToSet,
      })),
    }));
  };

  const handleAddSpec = () => {
    setFormData((prev) => ({
      ...prev,
      variantSpecValues: [
        ...prev.variantSpecValues,
        {
          specKey: "",
          label: "",
          type: "STRING",
          unit: "",
          stringValue: "",
          numericValue: null,
          booleanValue: null,
        },
      ],
    }));
  };

  const handleRemoveSpec = (index) => {
    setFormData((prev) => ({
      ...prev,
      variantSpecValues: prev.variantSpecValues.filter((_, i) => i !== index),
    }));
  };

  const handleSpecChange = (index, field, value) => {
    setFormData((prev) => {
      const newSpecs = [...prev.variantSpecValues];
      newSpecs[index] = { ...newSpecs[index], [field]: value };
      return { ...prev, variantSpecValues: newSpecs };
    });
  };

  const handleSelectSpecTemplate = (index, specCode) => {
    const selectedSpec = allSpecs.find((s) => s.code === specCode);
    if (!selectedSpec) return;

    setFormData((prev) => {
      const newSpecs = [...prev.variantSpecValues];
      newSpecs[index] = {
        ...newSpecs[index],
        specKey: selectedSpec.code,
        label: selectedSpec.label,
        type: selectedSpec.datatype,
        unit: selectedSpec.unit,

        stringValue: "",
        numericValue: null,
        booleanValue: null,
      };
      return { ...prev, variantSpecValues: newSpecs };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const tabs = [
    { id: "basic", name: "Thông tin cơ bản", icon: Box },
    { id: "pricing", name: "Giá & Tồn kho", icon: DollarSign },
    { id: "specs", name: "Thông số", icon: Settings },
    { id: "media", name: "Thư viện ảnh", icon: ImageIcon },
  ];

  const ModalTitle =
    mode === "create"
      ? "Thêm biến thể mới"
      : `Chỉnh sửa biến thể #${variant?.id}`;

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

  const renderSpecsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Danh sách thông số kỹ thuật
        </label>
        <button
          type="button"
          onClick={handleAddSpec}
          className="text-xs flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1.5 rounded-md hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Thêm thông số
        </button>
      </div>

      {formData.variantSpecValues.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
          <List className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">
            Chưa có thông số nào được cấu hình.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {formData.variantSpecValues.map((spec, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              {/* Cột 1: Chọn Loại Thông Số */}
              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Tên thông số
                </label>
                <select
                  value={spec.specKey}
                  onChange={(e) =>
                    handleSelectSpecTemplate(index, e.target.value)
                  }
                  className="w-full text-sm px-2 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none"
                >
                  <option value="">-- Chọn --</option>
                  {allSpecs.map((s) => (
                    <option key={s.id} value={s.code}>
                      {s.label} ({s.code})
                    </option>
                  ))}
                  {/* Nếu specKey hiện tại không nằm trong allSpecs (dữ liệu cũ), vẫn hiển thị */}
                  {spec.specKey &&
                    !allSpecs.find((s) => s.code === spec.specKey) && (
                      <option value={spec.specKey}>
                        {spec.label || spec.specKey}
                      </option>
                    )}
                </select>
              </div>

              {/* Cột 2: Nhập Giá Trị (Dynamic theo Type) */}
              <div className="flex-[2]">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Giá trị {spec.unit ? `(${spec.unit})` : ""}
                </label>
                {/* Xử lý hiển thị input dựa trên type */}
                {(!spec.type || spec.type === "string") && (
                  <input
                    type="text"
                    value={spec.stringValue || ""}
                    onChange={(e) =>
                      handleSpecChange(index, "stringValue", e.target.value)
                    }
                    placeholder="Nhập văn bản..."
                    className="w-full text-sm px-2 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                )}
                {spec.type === "number" ? (
                  <input
                    type="number"
                    step={spec.type === "INT" ? "1" : "0.01"}
                    value={spec.numericValue ?? ""}
                    onChange={(e) =>
                      handleSpecChange(
                        index,
                        "numericValue",
                        e.target.value === ""
                          ? null
                          : parseFloat(e.target.value)
                      )
                    }
                    placeholder="0"
                    className="w-full text-sm px-2 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                ) : null}
                {spec.type === "boolean" && (
                  <div className="flex items-center h-[38px]">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={spec.booleanValue === true}
                        onChange={(e) =>
                          handleSpecChange(
                            index,
                            "booleanValue",
                            e.target.checked
                          )
                        }
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        {spec.booleanValue ? "Có" : "Không"}
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* Cột 3: Nút xóa */}
              <button
                type="button"
                onClick={() => handleRemoveSpec(index)}
                className="mt-6 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                title="Xóa thông số này"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
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
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 text-red-500 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 shadow-sm border border-gray-200 dark:border-gray-600"
                  title="Xóa ảnh này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleSetPrimary(index)}
                  className={`absolute top-2 left-2 p-1.5 rounded-full shadow-sm border transition-all ${
                    item.isPrimary
                      ? "bg-blue-600 text-white border-blue-600 opacity-100"
                      : "bg-white/90 dark:bg-gray-800/90 text-gray-400 border-gray-200 dark:border-gray-600 opacity-0 group-hover:opacity-100 hover:text-yellow-500"
                  }`}
                  title={
                    item.isPrimary ? "Đây là ảnh chính" : "Đặt làm ảnh chính"
                  }
                >
                  <Star
                    className={`w-4 h-4 ${
                      item.isPrimary ? "fill-current" : ""
                    }`}
                  />
                </button>

                {item.isPrimary && (
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
                {activeTab === "specs" && renderSpecsTab()} {/* Tab Mới */}
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
