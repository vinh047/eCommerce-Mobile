import CategoryTabs from "@/component/ui/category/CategoryTabs";
import FilterSidebar from "@/component/ui/product/FilterSidebar";
import Breadcrumb from "@/component/ui/navigation/Breadcrumb";
import BreadcrumbSkeleton from "@/component/ui/navigation/BreadcrumbSkeleton";
import ProductCard from "@/component/ui/product/ProductCard";
import { getCategories, getCategoryBySlug } from "@/lib/api/categories";
import { Suspense } from "react";
import ListProducts from "./_component/ListProduct";

const products = [
  {
    id: 1,
    name: "iPhone 15 Pro 128GB",
    price: "28,990,000₫",
    discount: "-15%",
    rating: 47,
    rating_avg: 2.3,
    image: "/assets/image-products/iphone_air-3_2.webp",
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    price: "31,990,000₫",
    discount: "-5%",
    rating: 36,
    rating_avg: 4.5,
    image: "/assets/image-products/iphone_air-3_2.webp",
  },
  {
    id: 3,
    name: "Xiaomi 14 Ultra 512GB",
    price: "23,990,000₫",
    discount: "-20%",
    rating: 24,
    rating_avg: 4.7,
    image: "/assets/image-products/iphone_air-3_2.webp",
  },
  {
    id: 4,
    name: "OPPO Find X7 Pro",
    price: "18,990,000₫",
    discount: "-25%",
    rating: 17,
    rating_avg: 3.3,
    image: "/assets/image-products/iphone_air-3_2.webp",
  },
  {
    id: 5,
    name: "Google Pixel 8 Pro",
    price: "22,490,000₫",
    discount: "-10%",
    rating: 20,
    rating_avg: 2.6,
    image: "/assets/image-products/iphone_air-3_2.webp",
  },
  {
    id: 6,
    name: "Google Pixel 8 Pro",
    price: "22,490,000₫",
    discount: "-10%",
    rating: 20,
    rating_avg: 2.6,
    image: "/assets/image-products/iphone_air-3_2.webp",
  },
  {
    id: 7,
    name: "Google Pixel 8 Pro",
    price: "22,490,000₫",
    discount: "-10%",
    rating: 20,
    rating_avg: 2.6,
    image: "/assets/image-products/iphone_air-3_2.webp",
  },
];

export default async function ProductsPage({ params }) {
  const { categorySlug } = await params;

  const categoryWithSlug = await getCategoryBySlug(categorySlug);
  const categories = await getCategories();
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <CategoryTabs categories={categories} />

        <div className="flex gap-8">
          <FilterSidebar
            categorySlug={categorySlug}
            // onApply={(query, filters) => {
            //   // gọi API search sản phẩm hoặc push router
            //   console.log("APPLY =>", query, filters);
            // }}
            // onChange={(filters, query) => {
            //   // nếu muốn sync URL realtime
            //   // router.replace(`?${query}`, { scroll: false })
            // }}
          />
          <main className="flex-1">
            {/* Header: Breadcrumb (trái) + Sort (phải) */}
            <div className="flex items-center justify-between gap-3">
              {/* Breadcrumb */}
              <Suspense fallback={<BreadcrumbSkeleton />}>
                {/* Breadcrumb có thể là server hoặc client component */}
                <Breadcrumb
                  customLabels={{ [categorySlug]: categoryWithSlug.name }}
                />
              </Suspense>

              {/* Sort */}
            </div>
            {/* grid sản phẩm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <ListProducts />  
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
