import { Suspense } from "react";
import {
  getRootCategories,
  getCategories,
  getCategoriesWithSpecTemplates,
} from "@/lib/api/categoriesApi";
import { getProductsByCategory } from "@/lib/api/productApi";
import BannerSlider from "@/components/Home/banner/BannerSlider";
import CategorySection from "@/components/Home/category/CategorySection";
import CategorySidebar from "@/components/Home/category/CategorySidebar";
import CategorySidebarSkeleton from "@/components/Home/category/CategorySidebarSkeleton";
import HeaderLayout from "@/components/Layout/HeaderLayout";
import { getBanners } from "@/lib/api/bannerApi";
import Footer from "@/components/Home/Footer";
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
      <main>
        <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
          {/* Banner ở trên cùng */}
          <section>
            <BannerSlider banners={banners} />
          </section>

          {/* Danh mục sản phẩm NẰM DƯỚI banner, 1 khối ngang */}
          <section>
            <Suspense fallback={<CategorySidebarSkeleton />}>
              <CategorySidebar categories={categoriesSidbar} />
            </Suspense>
          </section>

          {/* Các block sản phẩm theo danh mục */}
          {allCategories.map(
            (cat, index) =>
              productsByCategory[index] &&
              productsByCategory[index].length > 0 && (
                <CategorySection
                  key={cat.id}
                  category={cat}
                  products={productsByCategory[index]}
                />
              )
          )}
        </div>
        <Footer />
      </main>
    </HeaderLayout>
  );
}
