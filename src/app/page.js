import BannerSlider from "@/components/Home/banner/BannerSlider";
import CategoryIcon from "@/components/Home/category/CategoryIcon";
import CategorySection from "@/components/Home/category/CategorySection";
import CategorySidebar from "@/components/Home/category/CategorySidebar";
import CategorySidebarSkeleton from "@/components/Home/category/CategorySidebarSkeleton";
import Link from "next/link";
import { Suspense } from "react";

export default async function HomePage() {
  // update: viết qua lib
  const res = await fetch("http://localhost:3000/api/categories");
  if (!res.ok) throw new Error("Fetch failed");
  const data = await res.json();
  const categories = data.data;

  return (
    <main>
      <div className="max-w-screen-xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-4">
          {/* Danh mục sản phẩm bên trái */}
          <Suspense fallback={<CategorySidebarSkeleton />}>
            <CategorySidebar categories={categories} />
          </Suspense>

          {/* Banner bên phải */}
          <section className="md:col-span-3">
            <BannerSlider />
          </section>
        </div>

        {categories.map((cat) => (
          <CategorySection key={cat.id} category={cat} limit={10} />
        ))}
      </div>
    </main>
  );
}
