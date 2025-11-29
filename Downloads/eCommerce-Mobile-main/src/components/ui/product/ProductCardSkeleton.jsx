function ProductCardSkeleton() {
  return (
    <div className="my-4 mx-2 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.2)] p-3 flex flex-col items-center text-center animate-pulse">
      {/* Ảnh sản phẩm giả */}
      <div className="relative w-full h-52 rounded-lg mb-3 overflow-hidden bg-gray-200" />

      {/* Tên sản phẩm giả */}
      <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />

      {/* Giá giả */}
      <div className="h-4 w-1/2 bg-gray-200 rounded mb-2" />

      {/* Đánh giá giả */}
      <div className="flex items-center justify-center gap-1 mb-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-gray-200 rounded-full" />
        ))}
        <div className="h-4 w-8 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export default ProductCardSkeleton;
