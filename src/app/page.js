import { Suspense } from "react";
import {
  getRootCategories,
  getCategories,
  getCategoriesWithSpecTemplates,
} from "@/lib/api/categoriesApi";
import { getProductsByCategory } from "@/lib/api/productApi";
import { getBanners } from "@/lib/api/bannerApi";

import BannerSlider from "@/components/Home/banner/BannerSlider";
import CategorySection from "@/components/Home/category/CategorySection";
import CategorySidebar from "@/components/Home/category/CategorySidebar";
import CategorySidebarSkeleton from "@/components/Home/category/CategorySidebarSkeleton";
import VerticalCategoryMenu from "@/components/Home/category/VerticalCategoryMenu";
import ServiceFeatures from "@/components/Home/ServiceFeatures";
import HeaderLayout from "@/components/Layout/HeaderLayout";
import Footer from "@/components/Home/Footer";
import Reveal from "@/components/Animations/Reveal"; // Đảm bảo bạn đã có component này

export const dynamic = "force-dynamic";

const LIMIT = 10;

export default async function HomePage() {
  const [categoriesSidbar, allCategories, banners] = await Promise.all([
    getCategoriesWithSpecTemplates(),
    getCategories(),
    getBanners(),
  ]);

  const productPromises = allCategories.map((cat) =>
    getProductsByCategory(cat.id, LIMIT)
  );
  const productsByCategory = await Promise.all(productPromises);

  return (
    <HeaderLayout>
      <main className="min-h-screen bg-gray-50/50 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          
          {/* --- HERO SECTION --- */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-auto lg:h-[400px]">
            {/* Cột Menu: Bay từ trái sang */}
            <div className="hidden lg:block lg:col-span-3 h-full">
              <Reveal direction="right" className="h-full" fullWidth>
                <VerticalCategoryMenu categories={categoriesSidbar} />
              </Reveal>
            </div>

            {/* Cột Banner: Bay từ phải sang, delay 0.1s */}
            <div className="col-span-1 lg:col-span-9 h-full">
              <Reveal direction="left" delay={0.1} className="h-full" fullWidth>
                <div className="h-full rounded-xl overflow-hidden shadow-sm bg-white">
                  <BannerSlider banners={banners.data} />
                </div>
              </Reveal>
            </div>
          </section>

          {/* --- SERVICE FEATURES --- */}
          {/* Trồi từ dưới lên, delay 0.2s */}
          <section>
            <Reveal direction="up" delay={0.2} fullWidth>
              <ServiceFeatures />
            </Reveal>
          </section>

          {/* --- MOBILE SIDEBAR --- */}
          {/* Chỉ hiện ở Mobile, trồi từ dưới lên */}
          <section className="block lg:hidden">
            <Reveal direction="up" fullWidth>
              <Suspense fallback={<CategorySidebarSkeleton />}>
                <CategorySidebar categories={categoriesSidbar} />
              </Suspense>
            </Reveal>
          </section>

          {/* --- CATEGORY SECTIONS --- */}
          {/* Lướt tới đâu trồi lên tới đó */}
          <div className="space-y-6">
            {allCategories.map(
              (cat, index) =>
                productsByCategory[index] &&
                productsByCategory[index].length > 0 && (
                  <Reveal key={cat.id} direction="up" delay={0.1} fullWidth>
                    <CategorySection
                      category={cat}
                      products={productsByCategory[index]}
                    />
                  </Reveal>
                )
            )}
          </div>
        </div>
      </main>
    </HeaderLayout>
  );
}