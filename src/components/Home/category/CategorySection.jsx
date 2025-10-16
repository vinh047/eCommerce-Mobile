import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { getProductsByCategory } from "@/lib/api/productApi";
import CategoryProductsDelay from "./CategoryProductsDelay";
import CategoryProductsSkeleton from "./CategoryProductsSkeleton";

async function CategorySection({ category, limit }) {
  const products = await getProductsByCategory(category.id, limit);

  return (
    <section className="px-2 sm:px-4 md:px-0 py-4">
      <div className="flex items-center justify-between mb-2 pe-4">
        <h2 className="text-xl font-semibold text-neutral-800">
          {category.name}
        </h2>
        <Link
          href={`/${category.slug}`}
          className="group relative flex items-center gap-1 text-neutral-800 hover:text-blue-600 transition-colors duration-200 text-sm font-medium"
        >
          <span className="relative after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 group-hover:after:w-full">
            Xem tất cả
          </span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 ease-in-out group-hover:translate-x-1" />
        </Link>
      </div>
      <Suspense
        fallback={<CategoryProductsSkeleton categoryName={category.name} />}
      >
        <CategoryProductsDelay
          title={category.name}
          products={products}
          delay={100}
        />
      </Suspense>
    </section>
  );
}

export default CategorySection;
