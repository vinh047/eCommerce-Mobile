import ProductCardSkeleton from "@/components/ui/product/ProductCardSkeleton";

function CategoryProductsSkeleton() {
  return (
    <div className="overflow-hidden h-[372px]">
      <div
        className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5`}
      >
        {[...Array(5)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default CategoryProductsSkeleton;
