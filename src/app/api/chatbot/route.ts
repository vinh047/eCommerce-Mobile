import { google } from '@ai-sdk/google';
import { generateText } from 'ai'; // ✅ Dùng generateText (Bắt buộc)
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

const formatCurrency = (value: any) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value));

async function getProductContext() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isDeleted: false,
        variants: { some: { stock: { gt: 0 } } }
      },
      take: 20,
      select: {
        name: true,
        ratingAvg: true,
        description: true,
        brand: { select: { name: true } },
        variants: { select: { color: true, price: true } }
      }
    });

    if (!products.length) return "Hiện tại chưa có dữ liệu sản phẩm.";

    return products.map(p => `
- ${p.name} (${p.brand.name})
  Giá: ${p.variants.map(v => `${v.color}: ${formatCurrency(v.price)}`).join(', ')}
`).join('\n');
  } catch (e) {
    return "";
  }
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const productContext = await getProductContext();

    const systemPrompt = `
    Bạn là AI tư vấn bán hàng chuyên nghiệp của cửa hàng thiết bị di động.
    
    NHIỆM VỤ:
    - Trả lời câu hỏi khách hàng dựa trên DANH SÁCH SẢN PHẨM bên dưới.
    - Luôn báo giá chính xác theo từng màu sắc (phiên bản).
    - Nếu sản phẩm hết hàng hoặc không có trong danh sách, hãy gợi ý sản phẩm khác cùng thương hiệu hoặc danh mục.
    - Trả lời ngắn gọn, thân thiện, sử dụng tiếng Việt tự nhiên.
    - Không bịa đặt thông tin không có trong dữ liệu.

    DANH SÁCH SẢN PHẨM HIỆN CÓ:
    ${productContext}
    `;

    // 1. Gọi AI
    const result = await generateText({
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      messages,
    });

    // 2. ✅ QUAN TRỌNG: Chỉ lấy phần .text để trả về
    return NextResponse.json({ 
      answer: result.text  // Lấy đúng chuỗi văn bản
    });

  } catch (error: any) {
    console.error("Lỗi AI:", error);
    return NextResponse.json({ 
      answer: "Xin lỗi, hệ thống đang bận. Bạn vui lòng thử lại sau nhé!" 
    });
  }
}