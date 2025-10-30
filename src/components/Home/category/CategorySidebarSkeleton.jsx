export default function CategorySidebarSkeleton() {
  return (
    <aside className="md:col-span-1 animate-pulse">
      {/* Placeholder cho tiêu đề */}
      <div className="h-6 w-3/4 rounded-md bg-gray-200 mb-6"></div>

      {/* Placeholder cho danh sách các mục */}
      <div className="space-y-2">
        {/* Lặp lại một số lần để tạo hiệu ứng danh sách */}
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-3 py-2"
          >
            {/* Placeholder cho icon */}
            <div className="h-10 w-10 flex-shrink-0 rounded-md bg-gray-200"></div>
            
            {/* Placeholder cho tên danh mục */}
            <div className="h-4 w-full rounded-md bg-gray-200"></div>
          </div>
        ))}
      </div>
    </aside>
  );
}