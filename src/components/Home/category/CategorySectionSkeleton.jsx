import { ArrowRight } from "lucide-react";
import CategoryProductsSkeleton from "./CategoryProductsSkeleton";

export default function CategorySectionSkeleton() {
  return (
    <section className="px-2 sm:px-4 md:px-0 py-6">
      {/* Header skeleton: giữ layout h2 + Link nhưng dùng shimmer */}
      <div className="flex items-center justify-between mb-2 pe-4">
        <div
          className="h-6 w-40 bg-neutral-200 rounded animate-pulse"
          aria-hidden
        />
        <div className="flex items-center gap-1">
          <div
            className="h-5 w-24 bg-neutral-200 rounded animate-pulse"
            aria-hidden
          />
          <ArrowRight className="w-4 h-4 text-neutral-300" />
        </div>
      </div>

      <CategoryProductsSkeleton />
    </section>
  );
}
