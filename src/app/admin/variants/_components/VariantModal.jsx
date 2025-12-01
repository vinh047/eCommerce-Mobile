// app/admin/variants/_components/VariantModal.jsx
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import variantsApi from "@/lib/api/variantsApi";
import VariantEditor from "./VariantEditor";

export default function VariantModal({
  mode,
  variant,
  allProducts = [],

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

  // Ưu tiên dùng initialSpecs nếu có, nếu không thì mới khởi tạo mảng rỗng
  const [allSpecs, setAllSpecs] = useState([]);

  // Chỉ fetch nếu KHÔNG có initialSpecs VÀ có productId (trường hợp Standalone cũ)
  useEffect(() => {
    if (formData.productId === 0) {
      variantsApi
        .getVariantByTemplateId(formData.productId)
        .then((res) => setAllSpecs(res || []))
        .catch((err) => console.error(err));
    }
  }, [formData.productId]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    onSave(formData); // Trả data về cho cha xử lý
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
          {/* Wrap một lớp div padding để Editor nằm gọn */}
          <div className="h-full p-4 overflow-y-auto custom-scrollbar">
            <VariantEditor
              data={formData}
              onChange={handleChange}
              allSpecs={allSpecs} // Truyền specs đã có
              products={allProducts}
              mode={mode}
              // Nếu có initialSpecs tức là đang ở trong ProductEditor -> tắt chọn Product
              isStandalone={allProducts.length != 0}
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
