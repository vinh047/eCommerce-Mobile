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
            MediaVariant: true,
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

      await tx.productSpecValue.deleteMany({ where: { productId } });
      if (specs && specs.length > 0) {
        const specsToCreate = specs.map((s: any) => ({
          productId,
          specKey: s.specKey,
          label: s.label,
          type: s.type,
          unit: s.unit,
          stringValue: s.stringValue,
          numericValue: s.numericValue,
          booleanValue: s.booleanValue,
        }));
        await tx.productSpecValue.createMany({ data: specsToCreate });
      }

      await tx.variant.deleteMany({ where: { productId } });

      if (variants && variants.length > 0) {
        for (const variant of variants) {
          await tx.variant.create({
            data: {
              productId,
              color: variant.color,
              price: variant.price,
              compareAtPrice: variant.compareAtPrice,
              stock: variant.stock,
              isActive:
                variant.isActive !== undefined ? variant.isActive : true,

              variantSpecValues: variant.variantSpecValues
                ? {
                    create: variant.variantSpecValues,
                  }
                : undefined,

              MediaVariant: variant.MediaVariant
                ? {
                    create: variant.MediaVariant,
                  }
                : undefined,
            },
          });
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Update Error:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Slug hoặc dữ liệu duy nhất đã tồn tại" },
        { status: 409 }
      );
    }
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
