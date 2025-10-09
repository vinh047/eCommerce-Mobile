"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const categoryNames = {
  "dien-thoai": "Điện thoại",
  laptop: "Laptop",
  "may-tinh-bang": "Máy tính bảng",
  "phu-kien": "Phụ kiện",
  "am-thanh": "Âm thanh",
  all: "Tất cả sản phẩm",
};

export function useCategorySlug() {
  const pathname = usePathname();
  const [categorySlug, setCategorySlug] = useState("all");
  const [label, setLabel] = useState(categoryNames["all"]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!pathname) return;

    const parts = pathname
      .replace(/^\/products\/?/, "")
      .split("/")
      .filter(Boolean);
    const slug = parts[0] || "all";
    const name = categoryNames[slug] || slug;

    console.log("slug: ", slug);

    setCategorySlug(slug);
    setLabel(name);
    setIsLoading(false);
  }, [pathname]);

  return { categorySlug, label, isLoading };
}
