import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: {
        brand: true,
        category: true,
        productSpecValues: true,
        variants: {
          include: {
            variantSpecValues: true,
            MediaVariant: {
              include: {
                Media: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ data: product });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const productId = Number(id);

  try {
    const body = await req.json();
    const {
      name,
      categoryId,
      brandId,
      description,
      specs,
      variants,
      isActive,
      slug,
    } = body;

    await prisma.$transaction(async (tx) => {
      // 1. Update Product
      await tx.product.update({
        where: { id: productId },
        data: {
          name,
          description,
          isActive,
          categoryId: Number(categoryId),
          brandId: Number(brandId),
          slug,
        },
      });

      // 2. Update Product Specs
      await tx.productSpecValue.deleteMany({ where: { productId } });
      if (specs && specs.length > 0) {
        const specsToCreate = specs.map((s: any) => ({
          productId,
          specKey: s.specKey,
          label: s.label,
          type: s.type,
          unit: s.unit,
          stringValue: s.stringValue ?? "",
          numericValue: s.numericValue ? Number(s.numericValue) : null,
          booleanValue: s.booleanValue ?? null,
        }));
        await tx.productSpecValue.createMany({ data: specsToCreate });
      }

      // 3. Xử lý Variants
      if (variants) {
        // --- LOGIC XÓA (FIX LỖI) ---
        const incomingIds = variants
          .filter((v: any) => v.id && !String(v.id).startsWith("temp-"))
          .map((v: any) => Number(v.id));

        // Tìm các ID variant thừa trong database
        const variantsToDelete = await tx.variant.findMany({
          where: {
            productId,
            id: { notIn: incomingIds },
          },
          select: { id: true },
        });

        const deleteIds = variantsToDelete.map((v) => v.id);

        if (deleteIds.length > 0) {
          // Xóa bảng con MediaVariant trước
          await tx.mediaVariant.deleteMany({
            where: { variantId: { in: deleteIds } },
          });

          // Xóa bảng con VariantSpecValue trước
          await tx.variantSpecValue.deleteMany({
            where: { variantId: { in: deleteIds } },
          });

          // Xóa Variant cha
          await tx.variant.deleteMany({
            where: { id: { in: deleteIds } },
          });
        }
        // --- HẾT LOGIC XÓA ---

        // Loop Update/Create
        for (const v of variants) {
          const mediaRelation = {
            deleteMany: {},
            create: Array.isArray(v.media)
              ? v.media.map((m: any) => ({
                  Media: {
                    create: {
                      url: m.url,
                      isPrimary: m.isPrimary ?? false,
                      sortOrder: m.sortOrder ?? 0,
                    },
                  },
                }))
              : [],
          };

          const specsRelation = {
            deleteMany: {},
            create: Array.isArray(v.variantSpecValues)
              ? v.variantSpecValues.map((s: any) => ({
                  specKey: s.specKey,
                  label: s.label || "",
                  type: s.type || "",
                  unit: s.unit || "",
                  stringValue: s.stringValue || null,
                  numericValue: s.numericValue || null,
                  booleanValue: s.booleanValue || null,
                }))
              : [],
          };

          const variantData = {
            color: v.color,
            price: Number(v.price),
            compareAtPrice: Number(v.compareAtPrice),
            stock: Number(v.stock),
            lowStockThreshold: Number(v.lowStockThreshold || 5),
            isActive: v.isActive ?? true,
          };

          if (v.id && !String(v.id).startsWith("temp-")) {
            await tx.variant.update({
              where: { id: Number(v.id) },
              data: {
                ...variantData,
                MediaVariant: mediaRelation,
                variantSpecValues: specsRelation,
              },
            });
          } else {
            await tx.variant.create({
              data: {
                productId,
                ...variantData,
                MediaVariant: { create: mediaRelation.create },
                variantSpecValues: { create: specsRelation.create },
              },
            });
          }
        }
      }
    });

    return NextResponse.json({ success: true, id: productId });
  } catch (error: any) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.product.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
