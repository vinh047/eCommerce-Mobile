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
import ProductCard from "@/components/ui/product/ProductCard";

const SORT_OPTIONS = [
  { label: "Mới nhất", value: "latest" },
  { label: "Giá: Thấp đến cao", value: "price-asc" },
  { label: "Giá: Cao đến thấp", value: "price-desc" },
  { label: "Tên: A-Z", value: "name-asc" },
  { label: "Tên: Z-A", value: "name-desc" },
];

export default async function ProductsPage({ params }) {
  const { categorySlug } = await params;

  // Bắt đầu cả hai promise mà không cần "await"
  const categoryPromise = getCategoryBySlug(categorySlug);
  const categoriesPromise = getCategoriesWithSpecTemplates();

  // Đợi cho cả hai promise hoàn thành cùng lúc
  const [category, categories] = await Promise.all([
    categoryPromise,
    categoriesPromise,
  ]);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <CategoryTabs categories={categories} />

        <div className="flex gap-8">
          <FilterSidebar category={category} />
          <main className="flex-1">
            {/* Header: Breadcrumb (trái) + Sort (phải) */}
            <div className="flex items-center justify-between gap-3">
              {/* Breadcrumb */}
              <Suspense fallback={<BreadcrumbSkeleton />}>
                {/* Breadcrumb có thể là server hoặc client component */}
                <Breadcrumb customLabels={{ [categorySlug]: category.name }} />
              </Suspense>

              {/* Sort */}
              <SortDropdown />
            </div>
            {/* grid sản phẩm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <ListProducts categoryId={category.id} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
