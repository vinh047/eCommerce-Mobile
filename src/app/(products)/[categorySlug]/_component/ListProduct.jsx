"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/component/ui/product/ProductCard";
import { getProducts } from "@/lib/api/product";

export default function ListProducts() {
  const sp = useSearchParams(); // ?ram=6GB,8GB&brand=apple...
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // useEffect(() => {
  //   let mounted = true;

  //   async function load() {
  //     try {
  //       setLoading(true);
  //       // Truyền NGUYÊN query từ URL
  //       const data = await getProducts(sp); // hoặc getProducts(window.location.search)
  //       if (mounted) setItems(data?.items ?? []);
  //     } catch (e) {
  //       if (mounted) setErr(e);
  //     } finally {
  //       if (mounted) setLoading(false);
  //     }
  //   }

  //   load();
  //   return () => {
  //     mounted = false;
  //   };
  // }, [sp]); // refetch khi query đổi

  if (loading) return <div>Đang tải…</div>;
  if (err) return <div>Lỗi: {String(err.message || err)}</div>;
  if (!items.length) return <div>Không có sản phẩm phù hợp</div>;

  return (
    <>
      {/* {items.map((p) => (
        <ProductCard
          key={p.id}
          product={{
            id: p.id,
            name: p.name,
            price: p.minPrice,
            image: p.image,
            rating: p.ratingCount,
            rating_avg: Number(p.ratingAvg),
            slug: p.slug,
          }}
        />
      ))} */}
    </>
  );
}
