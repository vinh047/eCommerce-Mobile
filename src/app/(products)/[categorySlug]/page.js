// page.js
import { Suspense } from "react";
import {
  getCategoryBySlug,
  getCategoriesWithSpecTemplates,
} from "@/lib/api/categoriesApi";
import CategoryTabs from "@/app/(products)/[categorySlug]/_component/CategoryTabs";
import Breadcrumb from "@/app/(products)/[categorySlug]/_component/navigation/Breadcrumb";
import BreadcrumbSkeleton from "@/app/(products)/[categorySlug]/_component/navigation/BreadcrumbSkeleton";
import FilterSidebar from "./_component/FilterSidebar";
import SortDropdown from "./_component/SortDropdown";
import ListProducts from "./_component/ListProduct";
import HeaderLayout from "@/components/Layout/HeaderLayout";
import Reveal from "@/components/Animations/Reveal";

export default async function ProductsPage({ params }) {
  const { categorySlug } = await params;

  const [category, categories] = await Promise.all([
    getCategoryBySlug(categorySlug),
    getCategoriesWithSpecTemplates(),
  ]);

  return (
    <HeaderLayout>
      <div className="bg-white min-h-screen">
        {/* --- Sticky Header: CategoryTabs --- */}
        <div className="sticky top-0 z-30 mt-5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="pt-2">
              <CategoryTabs categories={categories} />
            </div>
          </div>
        </div>

        {/* --- Phần Nội Dung Chính --- */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6 items-start">
            {/* Sidebar Filter - Sticky */}
            <aside className="hidden lg:block shrink-0 sticky top-[100px]">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                      ></path>
                    </svg>
                    Bộ lọc tìm kiếm
                  </h3>
                </div>
                <FilterSidebar category={category} />
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              {/* --- HEADER: Breadcrumb + Sort (Cùng 1 hàng) --- */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                {/* Trái: Breadcrumb */}
                <div className="flex-1">
                  <Suspense fallback={<BreadcrumbSkeleton />}>
                    <Breadcrumb
                      customLabels={{ [categorySlug]: category.name }}
                    />
                  </Suspense>
                </div>

                {/* Phải: Sort */}
                <div className="shrink-0">
                  <SortDropdown />
                </div>
              </div>

              {/* Grid Sản Phẩm */}
              <ListProducts categoryId={category.id} />
            </main>
          </div>
        </div>
      </div>
    </HeaderLayout>
  );
}
