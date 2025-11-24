import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const { productSpecs = [], variantSpecs = [] } = body;

    const { id } = await params;
    const templateId = Number(id);

    if (!Array.isArray(productSpecs) || !Array.isArray(variantSpecs)) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.specTemplate.update({
        where: { id: templateId },
        data: { version: { increment: 1 } },
      });

      await tx.productSpec.deleteMany({
        where: { specTemplateId: templateId },
      });

      for (let i = 0; i < productSpecs.length; i++) {
        const spec = productSpecs[i];

        await tx.productSpec.create({
          data: {
            specTemplateId: templateId,
            code: spec.code || `p_spec_${Date.now()}_${i}`,
            label: spec.label,

            datatype: spec.datatype || "string",
            control: spec.control || "input",
            valueType: spec.valueType || "discrete",

            unit: spec.unit,
            groupLabel: spec.groupLabel,
            isRequired: Boolean(spec.isRequired),
            filterable: Boolean(spec.filterable),
            displayOrder: i,

            options:
              spec.options?.length > 0
                ? {
                    create: spec.options.map((opt: any, idx: number) => ({
                      value: opt.value,
                      label: opt.label || opt.value,
                      sortOrder: idx,
                    })),
                  }
                : undefined,

            buckets:
              spec.buckets?.length > 0
                ? {
                    create: spec.buckets.map((b: any, idx: number) => ({
                      label: b.label,
                      gt: b.gt ? Number(b.gt) : undefined,
                      lte: b.lte ? Number(b.lte) : undefined,
                      sortOrder: idx,
                    })),
                  }
                : undefined,
          },
        });
      }

      await tx.variantSpec.deleteMany({
        where: { specTemplateId: templateId },
      });

      for (let i = 0; i < variantSpecs.length; i++) {
        const spec = variantSpecs[i];

        await tx.variantSpec.create({
          data: {
            specTemplateId: templateId,
            code: spec.code || `v_spec_${Date.now()}_${i}`,
            label: spec.label,

            datatype: spec.datatype || "string",
            control: spec.control || "input",
            valueType: spec.valueType || "discrete",

            unit: spec.unit,

            groupLabel: spec.groupLabel,

            isRequired: Boolean(spec.isRequired),
            isVariantKey: true,
            filterable: Boolean(spec.filterable),
            displayOrder: i,

            options:
              spec.options?.length > 0
                ? {
                    create: spec.options.map((opt: any, idx: number) => ({
                      value: opt.value,
                      label: opt.label || opt.value,
                      sortOrder: idx,
                    })),
                  }
                : undefined,

            buckets:
              spec.buckets?.length > 0
                ? {
                    create: spec.buckets.map((b: any, idx: number) => ({
                      label: b.label,
                      gt: b.gt ? Number(b.gt) : undefined,
                      lte: b.lte ? Number(b.lte) : undefined,
                      sortOrder: idx,
                    })),
                  }
                : undefined,
          },
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Save Spec Config Error:", error);
    //
    return NextResponse.json(
      {
        error: "Failed to save config",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
