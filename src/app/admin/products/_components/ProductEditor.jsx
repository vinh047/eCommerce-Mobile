"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  transformFormToAPIValues,
  transformProductToFormValues,
} from "../utils/form-helpers";

import BasicInfoForm from "./tabs/BasicInfoForm";
import SpecsForm from "./tabs/SpecsForm";
import VariantsForm from "./tabs/VariantsForm";

import { useProductMutations } from "../hooks/useProductMutations";
import { useTemplateFetcher } from "../hooks/useTemplateFetcher";

export default function ProductEditor({
  initialData,
  mode = "create",
  categories,
  brands,
}) {
  const [activeTab, setActiveTab] = useState(1);
  const router = useRouter();

  // 1. Setup Default Values
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

  const methods = useForm({
    defaultValues,
    mode: "onSubmit",
  });

  const { watch, handleSubmit, reset } = methods;

  // 2. Sync data when initialData loads (useful for async fetches)
  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset(transformProductToFormValues(initialData));
    }
  }, [initialData, reset, mode]);

  const selectedCategoryId = watch("categoryId");

  // 3. Hooks
  const { template, isLoadingTemplate } =
    useTemplateFetcher(selectedCategoryId);
  const { isMutating, createProduct, updateProduct } = useProductMutations();

  console.log("template: ", template)

  // 4. Fixed Submit Handler
  const onSubmit = async (data) => {
    try {
      const apiPayload = transformFormToAPIValues(data);
      console.log("Final Payload:", apiPayload);

      // We await the mutation here to ensure it finishes before redirecting
      if (mode === "create") {
        await createProduct(apiPayload);
      } else {
        await updateProduct(initialData.id, apiPayload);
      }

      // Only redirect if no error was thrown above
      router.push("/admin/products");
    } catch (error) {
      console.error("Failed to save product:", error);
      // Optional: Add toast notification here (e.g., toast.error("Có lỗi xảy ra"))
    }
  };

  // 5. Updated Tabs Configuration
  const tabs = [
    { id: 1, label: "Thông tin chung" },
    { id: 2, label: "Thông số kỹ thuật" },
    { id: 3, label: "Phiên bản & Giá" },
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
        {/* Using 'hidden' class keeps the state mounted so data isn't lost when switching tabs */}
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
        </div>
      </form>
    </FormProvider>
  );
}
