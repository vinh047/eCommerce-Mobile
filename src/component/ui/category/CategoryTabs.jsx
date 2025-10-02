import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Button } from "../form/Button";

const categories = [
  { id: 1, name: "Điện thoại", slug: "dien-thoai" },
  { id: 2, name: "Laptop", slug: "laptop" },
  { id: 3, name: "Máy tính bảng", slug: "may-tinh-bang" },
  { id: 4, name: "Phụ kiện", slug: "phu-kien" },
  { id: 5, name: "Âm thanh", slug: "am-thanh" },
];

function CategoryTabs() {
  const router = useRouter();

  const pathname = usePathname();
  const categorySlug = pathname.split("/")[2] || "all";
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => router.push(`/products`)}
          outline
          className={`inline-flex items-center justify-center rounded-2xl border px-4 py-2 text-sm font-medium transition-colors
                ${
                  categorySlug === "all"
                    ? "bg-blue-600 text-white border-blue-600 shadow"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
        >
          Tất cả
        </Button>
        {categories.map((category) => {
          const isActive = categorySlug === category.slug;

          return (
            <Button
              key={category.id}
              outline
              onClick={() => router.push(`/products/${category.slug}`)}
              className={`inline-flex items-center justify-center rounded-2xl border px-4 py-2 text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-blue-600 text-white border-blue-600 shadow"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
            >
              {category.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryTabs;
