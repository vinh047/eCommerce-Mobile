import prisma from "@/lib/prisma";

export const bucketService = {
  async getBucketByFacetId(facetId: number) {
    return await prisma.bucket.findMany({ where: { facetId } });
  },
};
