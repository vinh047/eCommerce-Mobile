import prisma from "@/lib/prisma";

export async function GET() {
  const media = await prisma.media.findMany();
  const variant = await prisma.variant.findMany();
  return Response.json({ media, variant });
}

export async function POST(req: Request) {
  const { pairs } = await req.json(); // [{ mediaId, variantId }, ...]

  await prisma.mediaVariant.createMany({
    data: pairs,
    skipDuplicates: true,
  });

  return Response.json({ success: true });
}