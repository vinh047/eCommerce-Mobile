import prisma from "@/lib/prisma";

export const specTemplateService = {
  async getByCategoryId(categoryId: number) {
    return await prisma.specTemplate.findFirst({ where: { categoryId } });
  },
};
