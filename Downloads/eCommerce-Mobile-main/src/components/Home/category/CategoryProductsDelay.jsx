// CategoryProductsDelay.jsx
"use client";
import { useEffect, useState } from "react";
import CategoryProducts from "./CategoryProducts";
import CategoryProductsSkeleton from "./CategoryProductsSkeleton";

export default function CategoryProductsDelay({ title, products, delay = 100 }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Đợi 100ms cho layout ổn định
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  if (!show) return <CategoryProductsSkeleton categoryName={title} />;
  return <CategoryProducts title={title} products={products} />;
}
