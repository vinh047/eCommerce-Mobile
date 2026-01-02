import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import CategoryProductsDelay from "./CategoryProductsDelay";
import CategoryProductsSkeleton from "./CategoryProductsSkeleton";

async function CategorySection({ category, products }) {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-50">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 uppercase flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-600 rounded-full inline-block"></span>
            {category.name}
          </h2>
          <Link
            href={`/${category.slug}`}
            className="group flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Xem tất cả
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
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
      </div>
    </section>
  );
}
export default CategorySection;
