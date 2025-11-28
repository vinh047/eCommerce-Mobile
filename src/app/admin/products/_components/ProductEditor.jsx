"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

import {
  transformFormToAPIValues,
  transformProductToFormValues,
} from "../utils/form-helpers"; // Đảm bảo đường dẫn đúng

import BasicInfoForm from "./tabs/BasicInfoForm";
import SpecsForm from "./tabs/SpecsForm";
import VariantsForm from "./tabs/VariantsForm";
import MediaForm from "./tabs/MediaForm";

import { useProductMutations } from "../hooks/useProductMutations";
import { useTemplateFetcher } from "../hooks/useTemplateFetcher";

export default function ProductEditor({
  initialData,
  mode = "create",
  categories,
  brands,
}) {
  const [activeTab, setActiveTab] = useState(1);

  // 1. Chuẩn bị dữ liệu ban đầu
  const defaultValues = useMemo(() => {
    if (mode === "edit" && initialData) {
      return transformProductToFormValues(initialData);
    }
    return {
      name: "",
      slug: "",
      categoryId: "",
      brandId: "",
      description: "",
      isActive: true,
      specs: {},
      variants: [],
      images: [],
    };
  }, [initialData, mode]);

  // 2. Khởi tạo Form
  const methods = useForm({
    defaultValues,
    mode: "onSubmit",
  });

  const { watch, handleSubmit, reset } = methods;

  // Reset form khi data API tải xong (quan trọng cho trang Edit)
  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset(transformProductToFormValues(initialData));
    }
  }, [initialData, reset, mode]);

  // 3. Lấy Template Specs dựa trên Category
  const selectedCategoryId = watch("categoryId");
  const { template, isLoadingTemplate } =
    useTemplateFetcher(selectedCategoryId);

  // 4. Xử lý Submit
  const { isMutating, createProduct, updateProduct } = useProductMutations();

  const onSubmit = (data) => {
    const apiPayload = transformFormToAPIValues(data);
    // console.log("Payload gửi đi:", apiPayload); // Debug nếu cần

    if (mode === "create") {
      createProduct(apiPayload);
    } else {
      updateProduct(initialData.id, apiPayload);
    }
  };

  const tabs = [
    { id: 1, label: "Thông tin chung" },
    { id: 2, label: "Thông số kỹ thuật" },
    { id: 3, label: "Phiên bản & Giá" },
    { id: 4, label: "Hình ảnh" },
  ];

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="pb-20 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200 sticky top-4 z-10">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/products"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {mode === "create"
                  ? "Thêm sản phẩm mới"
                  : `Sửa: ${initialData?.name}`}
              </h1>
              <p className="text-xs text-gray-500">
                {mode === "create"
                  ? "Điền thông tin sản phẩm"
                  : "Cập nhật thông tin chi tiết"}
              </p>
            </div>
          </div>
          <button
            type="submit"
            disabled={isMutating}
            className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-70 transition-all shadow-sm"
          >
            <Save className="w-4 h-4 mr-2" />
            {isMutating ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600 bg-blue-50/50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs Content */}
        <div className="min-h-[400px]">
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
