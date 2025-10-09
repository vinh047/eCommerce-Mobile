import prisma from "@/lib/prisma";

export const productSpecService = {
  async getById(id: number) {
    return await prisma.productSpec.findUnique({ where: { id } });
  },

  async getSpecsWithFacetsByTemplateId(specTemplateId: number) {
    return prisma.productSpec.findMany({
      where: { specTemplateId },
      include: {
        facet: {
          include: {
            buckets: {
              select: { id: true, label: true, gt: true, lte: true },
              orderBy: { id: "asc" },
            },
          },
        },
        options: {
          select: {
            id: true,
            label: true,
            value: true,
            datatype: true,
          },
          orderBy: { label: "asc" },
        },
      },
      orderBy: { id: "asc" },
    });
  },
};
