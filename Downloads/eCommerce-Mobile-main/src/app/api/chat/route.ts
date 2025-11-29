import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";


const productsRaw = await prisma.product.findMany({
  include: {
    category: true,
    variants: true,
    productSpecValues: true,
    brand: true,
  },
});

const products = productsRaw.map((p) => ({
  ...p,
  ratingAvg: Number(p.ratingAvg),
}));
export interface Brand {
  id: number;
  name: string;
  slug?: string;
  isActive: boolean;
  createdAt: string | Date;
}

export interface Category {
  id: number;
  name: string;
  slug?: string;
  parentId?: number | null;
  isActive: boolean;
  iconKey?: string | null;
  createdAt: string | Date;
}


export interface Variant {
  id: number;
  productId: number;
  color: string;
  price: string | Decimal | null;
  compareAtPrice?: string | Decimal | null;
  stock: number;
  isActive: boolean;
  createdAt: string | Date;
  lowStockThreshold?: number | null;
}
export interface ProductSpecValue {
  id: number;
  productId: number;
  specKey: string;
  label?: string | null;          // <- fix: label có thể null
  type: "string" | "number" | "boolean";
  unit?: string | null;
  stringValue?: string | null;
  numericValue?: number | null;
  booleanValue?: boolean | null;
}

export interface Product {
  id: number;
  name: string;
  slug?: string;
  description?: string | null;
  ratingAvg: number | string;
  ratingCount?: number;
  isActive: boolean;
  createdAt: string | Date;
  brand?: Brand;
  category?: Category;
  variants?: Variant[];
  productSpecValues?: ProductSpecValue[];
}
function semanticSearch(query: string, products: Product[], topN = 3) {
  const q = query.toLowerCase();

  return products
    .map((p) => {
      let score = 0;

      //  Match tên và mô tả
      const nameDesc = ((p.name ?? "") + " " + (p.description ?? "")).toLowerCase();
      const keywordScore = nameDesc
        .split(" ")
        .filter((w) => q.includes(w)).length;
      score += keywordScore;

      //  Match brand
      if (p.brand?.name && q.includes(p.brand.name.toLowerCase())) score += 2;

      //  Match thông số kỹ thuật numeric
      if (p.productSpecValues) { // <-- kiểm tra undefined
        for (const spec of p.productSpecValues) {
          if (!spec.numericValue) continue;
          if (spec.specKey.includes("ram") && q.includes("ram")) {
            score += Number(spec.numericValue) * 0.5;
          }
          if (spec.specKey.includes("battery") && (q.includes("pin") || q.includes("battery"))) {
            score += Number(spec.numericValue) / 1000; // scale pin
          }
          if (spec.specKey.includes("screen_size") && (q.includes("màn hình") || q.includes("screen"))) {
            score += Number(spec.numericValue);
          }
        }
      }

      //  Match rating
      if (q.includes("cao") || q.includes("tốt") || q.includes("nổi bật")) {
        score += Number(p.ratingAvg);
      }

      return { ...p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}
export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message)
      return NextResponse.json({ error: "Missing message" }, { status: 400 });

    // Lấy top sản phẩm liên quan
    const topProducts = semanticSearch(message, products);

    // Tạo prompt gửi Groq AI
    const prompt = `
Bạn là trợ lý bán hàng AI.
Chỉ được sử dụng các sản phẩm sau để tư vấn người dùng:
${JSON.stringify(topProducts, null, 2)}
Không được gợi ý các sản phẩm khác không có trong danh sách.

Người dùng hỏi: "${message}"

Hãy trả lời thân thiện, ngắn gọn, tư vấn sản phẩm phù hợp.
    `;

    // Gọi Groq AI
    const aiRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );

    const aiData = await aiRes.json();
    const reply = aiData.choices?.[0]?.message?.content ?? "Không tạo được phản hồi"
console.log("GROQ RESPONSE:", aiData);

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
