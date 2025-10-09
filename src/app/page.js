"use client";
import BannerSlider from "@/component/ui/banner/BannerSlider";
import CategoryIcon from "@/component/ui/category/CategoryIcon";
import CategorySection from "@/component/ui/category/CategorySection";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        setCategories(data.data); // vì controller trả { data: categories }
      } catch (err) {
        console.error("Error:", err);
      }
    }
    fetchCategories();
  }, []);
  return (
    <main>
      <div className="max-w-screen-xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-4">
          {/* Danh mục sản phẩm bên trái */}
          <aside className="md:col-span-1">
            <h2 className="text-base font-semibold text-neutral-800 mb-4 border-b pb-2">
              Danh mục sản phẩm
            </h2>
            <div className="space-y-2">
              {categories.map(({ id, icon_key: icon, name }) => (
                <Link
                  href={"/category"}
                  key={id}
                  className="group flex items-center gap-3 px-3 py-2 bg-gradient-to-r from-white to-slate-50 rounded-lg shadow-sm hover:shadow-md hover:from-blue-50 transition-all duration-300 cursor-pointer"
                >
                  <div className="p-2 rounded-md bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <CategoryIcon keyName={icon} />
                  </div>
                  <span className="text-sm text-neutral-700 group-hover:text-blue-700 font-medium transition-colors duration-300">
                    {name}
                  </span>
                </Link>
              ))}
            </div>
          </aside>

          {/* Banner bên phải */}
          <section className="md:col-span-3">
            <BannerSlider />
          </section>
        </div>

        {categories.map((cat) => (
          <CategorySection key={cat.id} category={cat} limit={10} />
        ))}
      </div>
    </main>
  );
}
