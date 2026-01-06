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

const products = productsRaw.map((p: any) => ({
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
  label?: string | null;
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

function similarity(a: string, b: string) {
  a = a.toLowerCase();
  b = b.toLowerCase();

  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;

  const longerLength = longer.length;
  if (longerLength === 0) return 1.0;

  const editDist = levenshteinDistance(longer, shorter);

  return (longerLength - editDist) / longerLength;
}

function levenshteinDistance(a: string, b: string) {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] =
        b[i - 1] === a[j - 1]
          ? matrix[i - 1][j - 1]
          : Math.min(
              matrix[i - 1][j - 1] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j] + 1
            );
    }
  }

  return matrix[b.length][a.length];
}

function semanticSearch(query: string, products: Product[], topN = 3) {
  const q = query.toLowerCase().trim();

  // Ngữ nghĩa theo nhu cầu
  const intents = {
    performance: ["hiệu năng", "mạnh", "chơi game", "mượt", "chip khỏe"],
    camera: ["camera", "chụp ảnh", "quay phim"],
    battery: ["pin", "trâu", "dùng lâu"],
    cheap: ["rẻ", "giá thấp", "giá rẻ", "tiết kiệm"],
    senior: ["người già", "dễ dùng", "đơn giản"],
    durable: ["bền", "trâu bò"],
    screen: ["màn hình", "hiển thị", "rộng"],
    gaming: ["fps", "game", "pubg", "mobile legends", "liên quân"],
  };

  function getPrice(p: Product) {
    if (!p.variants || p.variants.length === 0) return Infinity;
    return Math.min(...p.variants.map(v => Number(v.price) || Infinity));
  }

  // Hàm chấm điểm theo nhu cầu
  function matchIntentScore(p: Product) {
    const price = getPrice(p);
    let s = 0;

    // HIỆU NĂNG
    if (intents.performance.some(k => q.includes(k))) {
      const chip = p.productSpecValues?.find(s => s.specKey.includes("chip") || s.specKey.includes("cpu"));
      if (chip?.stringValue) {
        if (chip.stringValue.toLowerCase().includes("snapdragon")) s += 5;
        if (chip.stringValue.toLowerCase().includes("mediatek")) s += 3;
        if (chip.stringValue.toLowerCase().includes("unisoc")) s += 1;
      }
    }

    // CAMERA
    if (intents.camera.some(k => q.includes(k))) {
      const cam = p.productSpecValues?.find(s => s.specKey.includes("camera"));
      if (cam?.stringValue) {
        const mp = parseInt(cam.stringValue);
        if (mp >= 50) s += 5;
        else if (mp >= 12) s += 3;
        else if (mp >= 5) s += 1;
      }
    }

    // PIN
    if (intents.battery.some(k => q.includes(k))) {
      const pin = p.productSpecValues?.find(s => s.specKey.includes("battery"));
      if (pin?.numericValue) s += pin.numericValue / 1000;
    }

    // RẺ
    if (intents.cheap.some(k => q.includes(k))) {
      if (price < 3000000) s += 5;
      else if (price < 5000000) s += 3;
      else if (price < 10000000) s += 1;
    }

    // CHO NGƯỜI GIÀ
    if (intents.senior.some(k => q.includes(k))) {
      if (p.name.toLowerCase().includes("nokia")) s += 5;
      if (p.description?.toLowerCase().includes("đơn giản")) s += 2;
      if (p.description?.toLowerCase().includes("4g")) s += 1;
    }

    // ĐỘ BỀN
    if (intents.durable.some(k => q.includes(k))) {
      if (p.name.toLowerCase().includes("nokia")) s += 4;
    }

    // MÀN HÌNH
    if (intents.screen.some(k => q.includes(k))) {
      const sc = p.productSpecValues?.find(s => s.specKey.includes("screen"));
      if (sc?.numericValue) s += sc.numericValue;
    }

    // GAMING
    if (intents.gaming.some(k => q.includes(k))) {
      const chip = p.productSpecValues?.find(s => s.specKey.includes("chip"));
      if (chip?.stringValue?.toLowerCase().includes("snapdragon")) s += 6;
      if (chip?.stringValue?.toLowerCase().includes("mediatek")) s += 4;

      const ram = p.productSpecValues?.find(s => s.specKey.includes("ram"));
      if (ram?.numericValue) s += ram.numericValue / 2;
    }

    return s;
  }

  return products
    .map((p: any) => {
      let score = 0;

      // Match tên + mô tả
      const txt = (p.name + " " + (p.description ?? "")).toLowerCase();
      txt.split(" ").forEach((w) => {
        if (q.includes(w)) score++;
      });

      // Match brand
      if (p.brand?.name && q.includes(p.brand.name.toLowerCase()))
        score += 2;

      // Match category
      if (p.category?.name && q.includes(p.category.name.toLowerCase()))
        score += 1.5;

      // Match label / specKey
      p.productSpecValues?.forEach((spec) => {
        const label = (spec.label || "").toLowerCase();
        const key = spec.specKey.toLowerCase();

        if (q.includes(label) || q.includes(key)) {
          score += 2;
          //String scoring
          if(spec.stringValue) score+=2

          // Numeric scoring
          if (spec.numericValue) score += spec.numericValue * 0.1;

          // Boolean scoring
          if (spec.booleanValue !== null) {
            if (q.includes("có") && spec.booleanValue === true) score += 1;
            if (q.includes("không") && spec.booleanValue === false) score += 1;
          }
        }
      });

      // Nhu cầu người dùng
      score += matchIntentScore(p);

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
Không được gợi ý các sản phẩm khác không có trong danh sách.Nếu câu hỏi không liên quan thì không cần đưa ra sản phẩm.

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
    const reply =
      aiData.choices?.[0]?.message?.content ?? "Không tạo được phản hồi";
    console.log("GROQ RESPONSE:", aiData);

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
