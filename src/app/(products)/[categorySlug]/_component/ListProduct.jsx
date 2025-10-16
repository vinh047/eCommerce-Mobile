"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getProductsByFilters } from "@/lib/api/productApi";
import ProductCard from "@/components/ui/product/ProductCard";
import ProductCardSkeleton from "@/components/ui/product/ProductCardSkeleton";

const LIMIT = 8;

export default function ListProducts({ categoryId }) {
  const sp = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const params = new URLSearchParams(sp.toString());
        if (!params.has("page")) params.set("page", "1");
        params.set("limit", String(LIMIT));

        const { data } = await getProductsByFilters(
          categoryId,
          params.toString()
        );

        if (active) setItems(data ?? []);
      } catch (e) {
        if (active) setErr(e);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [sp, categoryId]);

  if (loading) {
    return (
      <>
        {Array.from({ length: LIMIT }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </>
    );
  }

  if (err) return <div>Lỗi: {String(err.message || err)}</div>;

  if (!items.length) return <div>Không có sản phẩm phù hợp</div>;

  return (
    <>
      {items.map((p) => (
        <ProductCard
          key={p.id}
          product={{
            id: p.id,
            name: p.name,
            minPrice: p.minPrice,
            image: p.image,
            rating: p.ratingCount,
            ratingAvg: Number(p.ratingAvg),
            slug: p.slug,
          }}
        />
      ))}
    </>
  );
}
