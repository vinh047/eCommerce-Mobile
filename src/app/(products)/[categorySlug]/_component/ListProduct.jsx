"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getProductsByFilters } from "@/lib/api/productApi";
import ProductCard from "@/components/ui/product/ProductCard";
import ProductCardSkeleton from "@/components/ui/product/ProductCardSkeleton";
import Pagination from "@/components/common/Pagination";
import ListProductsSkeleton from "./ListProductSkeleton";
import FlipReveal from "@/components/Animations/FlipReveal";

const LIMIT = 8;

export default function ListProducts({ categoryId }) {
  const sp = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [meta, setMeta] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    limit: LIMIT,
  });

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        setErr(null);

        const q = (sp.get("q") || "").trim();

        const params = new URLSearchParams(sp.toString());
        if (!params.has("page")) params.set("page", "1");
        // map pageSize param name if your API expects `limit`
        params.set("limit", String(LIMIT));

        if (q) params.set("q", q);
        else params.delete("q");

        const data = await getProductsByFilters(categoryId, params.toString());

        if (!active) return;

        setProducts(data?.data ?? []);
        // set meta nếu API trả meta; fallback giữ nguyên
        if (data?.meta) {
          setMeta({
            totalItems: Number(data.meta.totalItems ?? 0),
            totalPages: Number(data.meta.totalPages ?? 1),
            currentPage: Number(
              data.meta.currentPage ?? params.get("page") ?? 1
            ),
            limit: Number(data.meta.limit ?? LIMIT),
          });
        } else {
          // fallback: nếu API không trả meta, dùng tổng là products.length
          setMeta((m) => ({ ...m, totalItems: data?.data?.length ?? 0 }));
        }
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
    return <ListProductsSkeleton />;
  }

  if (err) return <div>Lỗi: {String(err.message || err)}</div>;

  if (!products.length) return <div>Không có sản phẩm phù hợp</div>;

  return (
    <div className="w-full">
      {/* Grid sản phẩm */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 md:gap-4">
        {products.map((p, index) => (
          // Bọc ProductCard trong FlipReveal
          // Truyền index vào để nó tự tính toán độ trễ, tạo hiệu ứng lật lần lượt
          <FlipReveal key={p.id} index={index} className="h-full">
            <ProductCard product={p} />
          </FlipReveal>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <Pagination totalItems={meta.totalItems} showPageSizeOptions={false} />
      </div>
    </div>
  );
}
