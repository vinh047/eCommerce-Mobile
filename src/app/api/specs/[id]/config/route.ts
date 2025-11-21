import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 1. Cập nhật Type cho params thành Promise
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { productSpecs } = await req.json();

    // 2. Await params trước khi dùng
    const { id } = await params;
    const templateId = Number(id);

    if (!Array.isArray(productSpecs)) {
      return NextResponse.json({ error: "Invalid format" }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      // Tăng version
      await tx.specTemplate.update({
        where: { id: templateId },
        data: { version: { increment: 1 } },
      });

      // Xóa cũ
      await tx.productSpec.deleteMany({
        where: { specTemplateId: templateId },
      });

      // Tạo mới
      for (let i = 0; i < productSpecs.length; i++) {
        const spec = productSpecs[i];

        await tx.productSpec.create({
          data: {
            specTemplateId: templateId,
            code: spec.code || `spec_${Date.now()}_${i}`,
            label: spec.label,

            // 3. SỬA LỖI VALUE TYPE:
            // Client gửi 'datatype', nhưng DB cần 'valueType'.
            // Ta gán valueType bằng chính datatype (hoặc map tương ứng nếu enum khác nhau)
            valueType: spec.valueType ||  "discrete",

            datatype: spec.datatype || "STRING",
            control: spec.control || "INPUT",
            unit: spec.unit,
            groupLabel: spec.groupLabel,
            isRequired: spec.isRequired || false,
            filterable: spec.filterable || false,
            displayOrder: i,
            options:
              spec.options && spec.options.length > 0
                ? {
                    create: spec.options.map((opt: any, idx: number) => ({
                      value: opt.value,
                      label: opt.label || opt.value,
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
