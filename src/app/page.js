import { Suspense } from "react";
import Link from "next/link";
import {
  getRootCategories,
  getCategories,
  getCategoriesWithSpecTemplates,
} from "@/lib/api/categoriesApi";
import { getProductsByCategory } from "@/lib/api/productApi";
import BannerSlider from "@/components/Home/banner/BannerSlider";
import CategoryIcon from "@/components/Home/category/CategoryIcon";
import CategorySection from "@/components/Home/category/CategorySection";
import CategorySidebar from "@/components/Home/category/CategorySidebar";
import CategorySidebarSkeleton from "@/components/Home/category/CategorySidebarSkeleton";

const LIMIT = 10;

export default async function HomePage() {
  const [categoriesSidbar, allCategories] = await Promise.all([
    getCategoriesWithSpecTemplates(),
    getCategories(),
  ]);

  const productPromises = allCategories.map((cat) =>
    getProductsByCategory(cat.id, LIMIT)
  );

  const productsByCategory = await Promise.all(productPromises);
  return (
    <main>
      <div className="max-w-screen-xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-4">
          {/* Danh mục sản phẩm bên trái */}
          <Suspense fallback={<CategorySidebarSkeleton />}>
            <CategorySidebar categories={categoriesSidbar} />
          </Suspense>

          {/* Banner bên phải */}
          <section className="md:col-span-3">
            <BannerSlider />
          </section>
        </div>

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
    </main>
  );
}
