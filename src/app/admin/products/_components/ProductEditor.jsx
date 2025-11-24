"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Import các Tabs (sẽ tạo ở dưới)
import BasicInfoForm from "./tabs/BasicInfoForm";
import SpecsForm from "./tabs/SpecsForm";
import VariantsForm from "./tabs/VariantsForm";
import MediaForm from "./tabs/MediaForm";

// Import Hooks
import { useProductMutations } from "../hooks/useProductMutations";
import { useTemplateFetcher } from "../hooks/useTemplateFetcher";

export default function ProductEditor({ initialData, categories, brands, mode = "create" }) {
  const [activeTab, setActiveTab] = useState(1);
  
  // 1. Khởi tạo Form
  const methods = useForm({
    defaultValues: initialData || {
      name: "",
      slug: "",
      categoryId: "",
      brandId: "",
      description: "",
      isActive: true,
      specs: {}, // Lưu ProductSpecValues
      variants: [], // Lưu danh sách biến thể
    },
  });

  const { watch, handleSubmit } = methods;
  
  // 2. Lắng nghe Category để lấy Template
  const selectedCategoryId = watch("categoryId");
  const { template, isLoadingTemplate } = useTemplateFetcher(selectedCategoryId);

  // 3. Xử lý Submit
  const { isMutating, createProduct, updateProduct } = useProductMutations();
  
  const onSubmit = (data) => {
    // Format lại dữ liệu nếu cần trước khi gửi API
    if (mode === "create") {
      createProduct(data);
    } else {
      updateProduct(initialData.id, data);
    }
  };

  // Danh sách Tabs
  const tabs = [
    { id: 1, label: "Thông tin chung" },
    { id: 2, label: "Thông số kỹ thuật" },
    { id: 3, label: "Phiên bản & Giá" },
    { id: 4, label: "Hình ảnh" },
  ];

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {mode === "create" ? "Thêm sản phẩm mới" : `Sửa: ${initialData?.name}`}
              </h1>
              <p className="text-sm text-gray-500">Điền đầy đủ thông tin các bước.</p>
            </div>
          </div>
          <button
            type="submit"
            disabled={isMutating}
            className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-70"
          >
            <Save className="w-4 h-4 mr-2" />
            {isMutating ? "Đang lưu..." : "Lưu sản phẩm"}
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-200 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tabs Content */}
        <div className="space-y-8">
          <div className={activeTab === 1 ? "block" : "hidden"}>
            <BasicInfoForm categories={categories} brands={brands} />
          </div>
          
          <div className={activeTab === 2 ? "block" : "hidden"}>
            <SpecsForm template={template} isLoading={isLoadingTemplate} />
          </div>

          <div className={activeTab === 3 ? "block" : "hidden"}>
            <VariantsForm template={template} />
          </div>

          <div className={activeTab === 4 ? "block" : "hidden"}>
            <MediaForm />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}