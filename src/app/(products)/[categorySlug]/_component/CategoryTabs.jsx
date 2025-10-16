"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/form/Button"; 

function CategoryTabs({categories}) {
  const router = useRouter();

  const pathname = usePathname();
  const categorySlug = pathname.split("/")[1];
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isActive = categorySlug === category.slug;

          return (
            <Button
              key={category.id}
              outline
              onClick={() => router.push(`/${category.slug}`)}
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
