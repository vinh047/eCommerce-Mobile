"use client";

export default function FilterSidebarSkeleton() {
  return (
    <aside className="w-72 hidden lg:block" id="filterSidebar">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden h-[calc(100vh-100px)]">
        <div className="scroll-area h-full px-4 pt-4">
          {/* Title skeleton */}
          <div className="h-4 w-28 bg-gray-200 rounded mb-4 animate-pulse" />

          {/* Fake filter groups */}
          {[...Array(4)].map((_, idx) => (
            <section key={idx} className="mb-5">
              <div className="h-3 w-24 bg-gray-200 rounded mb-3 animate-pulse" />
              <div className="space-y-2">
                {[...Array(4)].map((__, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-2 animate-pulse"
                  >
                    <div className="h-4 w-4 rounded bg-gray-200" />
                    {/* label giả dài hơn, random độ rộng */}
                    <div
                      className={[
                        "h-3 bg-gray-200 rounded",
                        i % 3 === 0 ? "w-32" : i % 3 === 1 ? "w-28" : "w-24",
                      ].join(" ")}
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}

          <div className="pb-24" />
        </div>

        {/* Action bar skeleton */}
        <div className="border-t bg-white px-4 py-3">
          <div className="flex gap-2">
            <div className="flex-1 h-8 bg-gray-200 rounded animate-pulse" />
            <div className="flex-1 h-8 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </aside>
  );
}
