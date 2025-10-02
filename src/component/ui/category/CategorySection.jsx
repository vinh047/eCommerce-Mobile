import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CategoryProductsDelay from "./CategoryProductsDelay";
import { Suspense } from "react";
import CategoryProductsSkeleton from "./CategoryProductsSkeleton";

// Fake data
const products = [
  {
    id: 1,
    name: "iPhone 15 Pro 128GB",
    price: "28,990,000₫",
    discount: "-15%",
    rating: 47,
    rating_avg: 2.3,
    image:
      "/assets/image-products/iphone_air-3_2.webp"
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    price: "31,990,000₫",
    discount: "-5%",
    rating: 36,
    rating_avg: 4.5,
    image:
      "/assets/image-products/iphone_air-3_2.webp"
  },
  {
    id: 3,
    name: "Xiaomi 14 Ultra 512GB",
    price: "23,990,000₫",
    discount: "-20%",
    rating: 24,
    rating_avg: 4.7,
    image:
      "/assets/image-products/iphone_air-3_2.webp"
  },
  {
    id: 4,
    name: "OPPO Find X7 Pro",
    price: "18,990,000₫",
    discount: "-25%",
    rating: 17,
    rating_avg: 3.3,
    image:
      "/assets/image-products/iphone_air-3_2.webp"
  },
  {
    id: 5,
    name: "Google Pixel 8 Pro",
    price: "22,490,000₫",
    discount: "-10%",
    rating: 20,
    rating_avg: 2.6,
    image:
      "/assets/image-products/iphone_air-3_2.webp"
  },
  {
    id: 6,
    name: "Google Pixel 8 Pro",
    price: "22,490,000₫",
    discount: "-10%",
    rating: 20,
    rating_avg: 2.6,
    image:
      "/assets/image-products/iphone_air-3_2.webp"
  },
  {
    id: 7,
    name: "Google Pixel 8 Pro",
    price: "22,490,000₫",
    discount: "-10%",
    rating: 20,
    rating_avg: 2.6,
    image:
      "/assets/image-products/iphone_air-3_2.webp"
  },
];

function CategorySection({ category, limit }) {
  return (
    <section className="px-2 sm:px-4 md:px-0 py-4">
      <div className="flex items-center justify-between mb-2 pe-4">
        <h2 className="text-xl font-semibold text-neutral-800">
          {category.name}
        </h2>
        <Link
          href="/product-category"
          className="group relative flex items-center gap-1 text-neutral-800 hover:text-blue-600 transition-colors duration-200 text-sm font-medium"
        >
          <span className="relative after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 group-hover:after:w-full">
            Xem tất cả
          </span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 ease-in-out group-hover:translate-x-1" />
        </Link>
      </div>
      <Suspense
        fallback={<CategoryProductsSkeleton categoryName={category.name} />}
      >
        <CategoryProductsDelay
          title={category.name}
          products={products}
          delay={100}
        />
      </Suspense>
    </section>
  );
}

export default CategorySection;
