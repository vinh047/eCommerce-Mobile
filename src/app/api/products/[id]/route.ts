import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// --- GET: Lấy chi tiết để sửa ---
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: {
        productSpecValues: true, // Lấy thông số chung
        variants: {
          include: {
            variantSpecValues: true, // Lấy thuộc tính biến thể
          },
        },
        // Media: true, // Nếu có
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // TRANSFORM DATA: Biến đổi dữ liệu để khớp với Form Frontend
    
    // 1. Chuyển ProductSpecValues array -> Object { screen: "OLED", ram: "8GB" }
    const specsObj: Record<string, any> = {};
    product.productSpecValues.forEach((pv) => {
      specsObj[pv.specKey] = pv.stringValue || pv.numericValue;
    });

    // 2. Chuyển Variants array -> Form Structure
    const formattedVariants = product.variants.map((v) => {
      // Gom variantSpecValues thành object attributes
      const attributes: Record<string, any> = {};
      v.variantSpecValues.forEach((vv) => {
        attributes[vv.specKey] = vv.stringValue;
      });

      return {
        id: v.id, // Giữ ID để update
        price: Number(v.price),
        compareAtPrice: Number(v.compareAtPrice),
        stock: v.stock,
        sku: "SKU-DEMO", // Lấy từ DB nếu có
        attributes: attributes, 
      };
    });

    const responseData = {
      ...product,
      specs: specsObj,       // Dữ liệu cho Tab 2
      variants: formattedVariants, // Dữ liệu cho Tab 3
    };

    return NextResponse.json({ data: responseData });

  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// --- PUT: Cập nhật sản phẩm ---
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { name, categoryId, brandId, description, specs, variants, isActive } = body;
    
    const productId = Number(id);

    await prisma.$transaction(async (tx) => {
      // 1. Update Info cơ bản
      await tx.product.update({
        where: { id: productId },
        data: {
          name,
          description,
          isActive,
          categoryId: Number(categoryId),
          brandId: Number(brandId),
          // slug: update slug nếu cần
        },
      });

      // 2. Update Specs (Chiến thuật: Xóa hết cũ -> Tạo mới cho đơn giản)
      // (Cách tối ưu hơn là so sánh diff, nhưng xóa đi tạo lại an toàn cho dữ liệu EAV)
      await tx.productSpecValue.deleteMany({ where: { productId } });
      
      if (specs && Object.keys(specs).length > 0) {
        const specEntries = Object.entries(specs).map(([key, value]) => ({
          productId,
          specKey: key,
          stringValue: String(value),
          type: "STRING",
        }));
        await tx.productSpecValue.createMany({ data: specEntries });
      }

      // 3. Update Variants (Chiến thuật: Xóa hết cũ -> Tạo mới)
      // LƯU Ý: Nếu hệ thống đã có đơn hàng liên kết với VariantId, 
      // bạn KHÔNG ĐƯỢC xóa mà phải dùng upsert. 
      // Ở đây mình demo cách Xóa -> Tạo lại (Reset variants)
      
      await tx.variant.deleteMany({ where: { productId } });
      // (Prisma Cascade sẽ tự xóa variantSpecValues cũ)

      if (variants && Array.isArray(variants)) {
        for (const v of variants) {
          const newVariant = await tx.variant.create({
            data: {
              productId,
              price: v.price || 0,
              compareAtPrice: v.compareAtPrice,
              stock: v.stock || 0,
              color: "Default",
              isActive: true,
            },
          });

          if (v.attributes) {
            const variantSpecEntries = Object.entries(v.attributes).map(([key, value]) => ({
              variantId: newVariant.id,
              specKey: key,
              stringValue: String(value),
              type: "STRING",
            }));
            await tx.variantSpecValue.createMany({ data: variantSpecEntries });
          }
        }
      }
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- DELETE: Xóa sản phẩm ---
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Prisma Schema nếu set onDelete: Cascade thì chỉ cần xóa Product là xong
    await prisma.product.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}