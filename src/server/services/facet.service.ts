import prisma from "@/lib/prisma";

export const facetService = {
  async getById(id: number) {
    return await prisma.facet.findUnique({ where: { id } });
  },
};
