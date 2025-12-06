// app/admin/variants/_components/VariantModal.jsx
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import VariantEditor from "./VariantEditor";
import variantsApi from "@/lib/api/variantsApi";
import { useTemplateFetcher } from "../../products/hooks/useTemplateFetcher";

export default function VariantModal({
  mode,                // "create" | "edit"
  variant,
  allProducts = [],
  // ✅ nếu trang cha có sẵn template (Product page) thì truyền vào đây
  variantSpecs: variantSpecsFromParent,
  // optional: nếu cha biết luôn categoryId
  categoryId: categoryIdFromParent,
  onClose,
  onSave,
}) {
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

  // 🔹 1) Nếu cha truyền sẵn variantSpecs => dùng luôn, KHÔNG fetch
  const useExternalSpecs = !!variantSpecsFromParent;

  // 🔹 2) categoryId dùng cho useTemplateFetcher khi KHÔNG có variantSpecsFromParent
  const [categoryId, setCategoryId] = useState(
    categoryIdFromParent ?? null
  );

  // EDIT: nếu không có template sẵn & không có categoryIdFromParent → lấy category theo variantId
  useEffect(() => {
    if (useExternalSpecs || categoryIdFromParent) return;
    if (mode === "edit" && variant?.id && !categoryId) {
      variantsApi
        .getCategoryById(variant.id)
        .then((res) => {
          if (res?.categoryId) setCategoryId(res.categoryId);
        })
        .catch((err) =>
          console.error("Failed to fetch category by variantId:", err)
        );
    }
  }, [useExternalSpecs, mode, variant?.id, categoryId, categoryIdFromParent]);

  // CREATE: nếu không có template sẵn & user chọn Product cha → lấy category từ allProducts
  useEffect(() => {
    if (useExternalSpecs || categoryIdFromParent) return;
    if (mode === "create" && formData.productId && !categoryId) {
      const selectedProduct = allProducts.find(
        (p) => p.id === formData.productId
      );
      if (selectedProduct?.categoryId) {
        setCategoryId(selectedProduct.categoryId);
      }
    }
  }, [useExternalSpecs, mode, formData.productId, allProducts, categoryId, categoryIdFromParent]);

  // 🔹 3) Chỉ gọi hook lấy template nếu KHÔNG có variantSpecs từ parent
  const { template, isLoadingTemplate } = useTemplateFetcher(
    useExternalSpecs ? null : categoryId
  );

  const variantSpecs = useExternalSpecs
    ? variantSpecsFromParent
    : template?.variantSpecs || [];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 rounded-t-xl">
          <h3 className="text-lg font-bold">
            {mode === "create" ? "Thêm biến thể mới" : "Chỉnh sửa biến thể"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden relative bg-gray-100 dark:bg-gray-900/50">
          <div className="h-full p-4 overflow-y-auto custom-scrollbar">
            <VariantEditor
              data={formData}
              onChange={handleChange}
              allSpecs={variantSpecs}           // ⬅ template variantSpecs luôn ở đây
              products={allProducts}
              mode={mode}
              isStandalone={allProducts.length !== 0}
              isLoadingSpecs={isLoadingTemplate && !useExternalSpecs}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end gap-3 bg-white dark:bg-gray-800 rounded-b-xl z-10">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm"
          >
            {mode === "create" ? "Thêm vào danh sách" : "Cập nhật"}
          </button>
        </div>
      </div>
    </div>
  );
}
