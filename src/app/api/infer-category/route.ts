// src/app/api/infer-category/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import compareTwoStrings from "string-similarity-js";
import { Prisma } from "@prisma/client";

/**
 * API infer-category
 * - Nhận { q: string } trong body
 * - Trả về { ok: true, category: "<slug>", reason: "<method>", score?: number } nếu tìm được category
 * - Nếu không tìm được match rõ ràng, trả về category đầu tiên (fallback)
 *
 * Chiến lược:
 * 1) exact match trên product.name / product.slug
 * 2) token match: tìm products chứa token, chọn category xuất hiện nhiều nhất
 * 3) fuzzy match trên product names (top sample)
 * 4) fuzzy match trên category names (fallback)
 * 5) nếu vẫn không có match, trả về category đầu tiên (fallback)
 *
 * Lưu ý: điều chỉnh thresholds và sample sizes theo dữ liệu thực tế.
 */

function normalize(s?: string | null) {
  return (s || "").toLowerCase().trim();
}

type InferResultSuccess = {
  ok: true;
  category: string;
  reason: string;
  score?: number;
};
type InferResultFail = { ok: false; reason: string; error?: string };
type InferResult = InferResultSuccess | InferResultFail;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const qRaw = String(body?.q || "").trim();
    if (!qRaw) {
      return NextResponse.json(
        { ok: false, reason: "empty_query" } as InferResultFail,
        { status: 400 }
      );
    }

    const q = normalize(qRaw);
    const tokens = q.split(/\s+/).filter(Boolean);

    // 1) Exact product name or slug match (priority)
    const productExact = await prisma.product.findFirst({
      where: {
        isDeleted: false,
        OR: [
          { name: { contains: qRaw, mode: "insensitive" as Prisma.QueryMode } },
          { slug: { contains: qRaw, mode: "insensitive" as Prisma.QueryMode } },
        ],
      },
      include: { category: { select: { slug: true } } },
    });

    if (productExact && productExact.category?.slug) {
      return NextResponse.json({
        ok: true,
        category: productExact.category.slug,
        reason: "product_exact",
      } as InferResultSuccess);
    }

    // 2) Token match: tìm products chứa ít nhất 1 token
    let tokenProducts: Array<{
      id: number;
      name: string;
      category?: { slug?: string };
    }> = [];
    if (tokens.length > 0) {
      // build OR conditions for tokens across product.name and product.slug
      const tokenOr: Prisma.ProductWhereInput[] = tokens.flatMap((t: any) => [
        { name: { contains: t, mode: "insensitive" as Prisma.QueryMode } },
        { slug: { contains: t, mode: "insensitive" as Prisma.QueryMode } },
      ]);

      tokenProducts = await prisma.product.findMany({
        where: { OR: tokenOr, isDeleted: false },
        include: { category: { select: { slug: true } } },
        take: 200, // giới hạn để tránh truy vấn quá nặng
      });
    }

    if (tokenProducts.length > 0) {
      // thống kê category xuất hiện nhiều nhất
      const freq: Record<string, number> = {};
      for (const p of tokenProducts) {
        const slug = p.category?.slug || "__unknown";
        freq[slug] = (freq[slug] || 0) + 1;
      }
      const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
      const best = sorted[0];
      if (best && best[0] !== "__unknown") {
        return NextResponse.json({
          ok: true,
          category: best[0],
          reason: "token_freq",
        } as InferResultSuccess);
      }
    }

    // 3) Fuzzy match on product names: sample products and compute similarity
    const SAMPLE_LIMIT = 500;
    const sampleProducts = await prisma.product.findMany({
      where: { isActive: true, isDeleted: false },
      select: { id: true, name: true, slug: true },
      take: SAMPLE_LIMIT,
    });

    let bestProductMatch: { slug?: string; score: number } | null = null;
    for (const p of sampleProducts) {
      const score = compareTwoStrings(normalize(p.name), q);
      if (!bestProductMatch || score > bestProductMatch.score) {
        bestProductMatch = { slug: p.slug, score };
      }
    }

    const PRODUCT_FUZZY_THRESHOLD = 0.6;
    if (
      bestProductMatch &&
      bestProductMatch.score >= PRODUCT_FUZZY_THRESHOLD &&
      bestProductMatch.slug
    ) {
      const prod = await prisma.product.findUnique({
        where: { slug: bestProductMatch.slug },
        include: { category: { select: { slug: true } } },
      });
      if (prod && prod.category?.slug) {
        return NextResponse.json({
          ok: true,
          category: prod.category.slug,
          reason: "fuzzy_product",
          score: bestProductMatch.score,
        } as InferResultSuccess);
      }
    }

    // 4) Fuzzy match với category names (fallback)
    const allCats = await prisma.category.findMany({
      where: { isActive: true, isDeleted: false },
      select: { name: true, slug: true },
    });

    let bestCat: { slug: string; score: number } | null = null;
    for (const c of allCats) {
      const score = compareTwoStrings(normalize(c.name), q);
      if (!bestCat || score > bestCat.score) bestCat = { slug: c.slug, score };
    }

    const CATEGORY_FUZZY_THRESHOLD = 0.45;
    if (bestCat && bestCat.score >= CATEGORY_FUZZY_THRESHOLD) {
      return NextResponse.json({
        ok: true,
        category: bestCat.slug,
        reason: "fuzzy_category",
        score: bestCat.score,
      } as InferResultSuccess);
    }

    // 5) Nếu không tìm được category phù hợp theo các phương pháp trên,
    //    fallback: trả về category đầu tiên (theo thứ tự id asc hoặc theo điều kiện isActive)
    const firstCategory = await prisma.category.findFirst({
      where: { isActive: true, isDeleted: false },
      orderBy: { id: "asc" },
      select: { slug: true },
    });

    if (firstCategory && firstCategory.slug) {
      return NextResponse.json({
        ok: true,
        category: firstCategory.slug,
        reason: "fallback_first_category",
      } as InferResultSuccess);
    }

    // Nếu không có category nào trong DB (rất hiếm), trả no_match
    return NextResponse.json(
      { ok: false, reason: "no_category_in_db" } as InferResultFail,
      { status: 200 }
    );
  } catch (err: any) {
    console.error("POST /api/infer-category error:", err);
    return NextResponse.json(
      {
        ok: false,
        reason: "server_error",
        error: String(err?.message || err),
      } as InferResultFail,
      { status: 500 }
    );
  }
}
