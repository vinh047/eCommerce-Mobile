"use client";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/form/Button";
import { FaTag } from "react-icons/fa"; // hoặc icon phù hợp
import { ROUTES } from "@/config/routes";

function CategoryTabs({ categories }) {
  const router = useRouter();
  const pathname = usePathname();
  const categorySlug = pathname.split("/")[1];

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
        {categories.map((category) => {
          const isActive = categorySlug === category.slug;

          return (
            <Button
              key={category.id}
              outline
              onClick={() => router.push(ROUTES.category(category.slug))}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
            >
              <FaTag className="text-xs" />
              {category.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryTabs;
