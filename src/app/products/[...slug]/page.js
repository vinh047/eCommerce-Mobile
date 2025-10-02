"use client";

import CategoryTabs from "@/component/ui/category/CategoryTabs";
import FilterSidebar from "@/component/ui/product/FilterSidebar";
import Breadcrumb from "@/component/ui/navigation/Breadcrumb";
import BreadcrumbSkeleton from "@/component/ui/navigation/BreadcrumbSkeleton";
import { useCategorySlug } from "@/hooks/useCategorySlug";
import ProductCard from "@/component/ui/product/ProductCard";

const products = [
  {
    id: 1,
    name: "iPhone 15 Pro 128GB",
    price: "28,990,000₫",
    discount: "-15%",
    rating: 47,
    rating_avg: 2.3,
    image:
      "/assets/image-products/iphone_air-3_2.webp", 
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    price: "31,990,000₫",
    discount: "-5%",
    rating: 36,
    rating_avg: 4.5,
    image:
      "/assets/image-products/iphone_air-3_2.webp",
  },
  {
    id: 3,
    name: "Xiaomi 14 Ultra 512GB",
    price: "23,990,000₫",
    discount: "-20%",
    rating: 24,
    rating_avg: 4.7,
    image:
      "/assets/image-products/iphone_air-3_2.webp"
  },
  {
    id: 4,
    name: "OPPO Find X7 Pro",
    price: "18,990,000₫",
    discount: "-25%",
    rating: 17,
    rating_avg: 3.3,
    image:
      "/assets/image-products/iphone_air-3_2.webp"
  },
  {
    id: 5,
    name: "Google Pixel 8 Pro",
    price: "22,490,000₫",
    discount: "-10%",
    rating: 20,
    rating_avg: 2.6,
    image:
      "/assets/image-products/iphone_air-3_2.webp"
  },
  {
    id: 6,
    name: "Google Pixel 8 Pro",
    price: "22,490,000₫",
    discount: "-10%",
    rating: 20,
    rating_avg: 2.6,
    image:
      "/assets/image-products/iphone_air-3_2.webp"
  },
  {
    id: 7,
    name: "Google Pixel 8 Pro",
    price: "22,490,000₫",
    discount: "-10%",
    rating: 20,
    rating_avg: 2.6,
    image:
      "/assets/image-products/iphone_air-3_2.webp"
  },
];

export default function ProductsPage() {
  const { categorySlug, label, isLoading } = useCategorySlug();

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <CategoryTabs />

        <div className="flex gap-8">
          <FilterSidebar
            categorySlug="dien-thoai"
            onApply={(query, filters) => {
              // gọi API search sản phẩm hoặc push router
              console.log("APPLY =>", query, filters);
            }}
            onChange={(filters, query) => {
              // nếu muốn sync URL realtime
              // router.replace(`?${query}`, { scroll: false })
            }}
          />
          <main className="flex-1">
            {/* Header: Breadcrumb (trái) + Sort (phải) */}
            <div className="flex items-center justify-between gap-3">
              {/* Breadcrumb */}
              {isLoading ? (
                <BreadcrumbSkeleton />
              ) : (
                <Breadcrumb customLabels={{ products: "Sản phẩm" }} />
              )}

              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sắp xếp:</span>
                <div className="relative">
                  <select
                    className="appearance-none w-[180px] rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-8"
                    defaultValue="popular"
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v) sp.set("sort", v);
                      else sp.delete("sort");
                      const qs = sp.toString();
                      router.push(qs ? `?${qs}` : "?");
                    }}
                  >
                    <option value="popular">Phổ biến nhất</option>
                    <option value="newest">Mới nhất</option>
                    <option value="price_asc">Giá tăng dần</option>
                    <option value="price_desc">Giá giảm dần</option>
                    <option value="rating_desc">Đánh giá cao</option>
                  </select>

                  {/* Custom arrow icon */}
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            {/* grid sản phẩm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {products.map((product) => {
                return <ProductCard key={product.id} product={product} />;
              })}
            </div>
          </main>
        </div>
      </div>

      {/* Minimal styles like the screenshot */}
      <style jsx global>{`
        .focus-ring:focus {
          outline: 2px solid #2563eb;
          outline-offset: 2px;
        }
        .sidebar-filter {
          max-height: calc(100vh - 120px);
          overflow-y: auto;
        }
        /* Tối giản giống ảnh: bỏ shadow/nền, chữ nhỏ, spacing gọn */
        aside section + section {
          margin-top: 12px;
        }
        @media (max-width: 1023px) {
          #filterSidebar {
            position: fixed;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100vh;
            background: #fff;
            z-index: 50;
            transition: left 0.3s ease;
            padding: 60px 16px 16px;
          }
          #filterSidebar.open {
            left: 0;
          }
        }
      `}</style>
    </div>
  );
}
