import ProductCardSkeleton from "@/components/ui/product/ProductCardSkeleton";

const LIMIT = 8; // Khớp với LIMIT bên file chính

export default function ListProductsSkeleton() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 md:gap-4">
        {Array.from({ length: LIMIT }).map((_, index) => (
          <div key={index} className="h-full">
            <ProductCardSkeleton />
          </div>
        ))}
      </div>

      {/* Pagination Skeleton (Placeholder cho phân trang) */}
      <div className="mt-8 flex justify-center">
        {/* Giả lập thanh phân trang đang load */}
        <div className="h-10 w-64 bg-gray-200 rounded-md animate-pulse" />
      </div>
    </div>
  );
}
