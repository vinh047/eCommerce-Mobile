// Xóa prisma/migrations
// npx prisma migrate dev --name init
// npx prisma migrate reset --force
import { PrismaClient, Prisma } from "@prisma/client";
import {
  categories,
  brands,
  specTemplates,
  productSpecs,
  productSpecOptions,
  productBuckets,
  variantSpecs,
  variantSpecOptions,
  variantBuckets,
  productsToCreate,
  productSpecValuesToCreate,
  variant as variantsToCreate, // Đổi tên để tránh trùng với model 'variant'
  variantSpecValuesToCreate,
  MediaArray,
  MediaVariant,
} from "./seedData2";

const prisma = new PrismaClient();

async function main() {
  console.log(`Bắt đầu quá trình seeding...`);

  // --- 1. Xóa dữ liệu cũ ---
  // Xóa theo thứ tự ngược lại của các quan hệ để tránh lỗi khóa ngoại
  console.log("Đang xóa dữ liệu cũ...");
  await prisma.mediaVariant.deleteMany();
  await prisma.media.deleteMany();
  await prisma.variantSpecValue.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.productSpecValue.deleteMany();
  await prisma.product.deleteMany();
  await prisma.variantBucket.deleteMany();
  await prisma.variantSpecOption.deleteMany();
  await prisma.variantSpec.deleteMany();
  await prisma.productBucket.deleteMany();
  await prisma.productSpecOption.deleteMany();
  await prisma.productSpec.deleteMany();
  await prisma.specTemplate.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.mediaVariant.deleteMany();
  console.log("Đã xóa xong dữ liệu cũ.");

  // --- 2. Seed dữ liệu cơ bản (không có phụ thuộc) ---
  console.log(`Đang seed Categories...`);
  await prisma.category.createMany({ data: categories });

  console.log(`Đang seed Brands...`);
  await prisma.brand.createMany({ data: brands });

  // --- 3. Seed Spec Templates (phụ thuộc vào Category) ---
  console.log(`Đang seed SpecTemplates...`);
  for (const template of specTemplates) {
    await prisma.specTemplate.create({ data: template });
  }

  // LƯU Ý QUAN TRỌNG:
  // Dữ liệu bạn cung cấp sử dụng ID được hard-code (ví dụ: specTemplateId: 1).
  // Đoạn script này sẽ hoạt động đúng nếu DB trống (sau khi xóa)
  // và ID tự tăng bắt đầu từ 1.

  // --- 4. Seed Product Specs và các bảng liên quan ---
  console.log(`Đang seed ProductSpecs...`);
  await prisma.productSpec.createMany({ data: productSpecs });

  console.log(`Đang seed ProductSpecOptions...`);
  await prisma.productSpecOption.createMany({ data: productSpecOptions });

  console.log(`Đang seed ProductBuckets...`);
  for (const bucket of productBuckets) {
    await prisma.productBucket.create({
      data: {
        ...bucket,
        // Chuyển đổi string sang Decimal
        gt: bucket.gt ? new Prisma.Decimal(bucket.gt) : null,
        lte: bucket.lte ? new Prisma.Decimal(bucket.lte) : null,
      },
    });
  }

  // --- 5. Seed Variant Specs và các bảng liên quan ---
  console.log(`Đang seed VariantSpecs...`);
  await prisma.variantSpec.createMany({ data: variantSpecs });

  console.log(`Đang seed VariantSpecOptions...`);
  await prisma.variantSpecOption.createMany({ data: variantSpecOptions });

  console.log(`Đang seed VariantBuckets...`);
  for (const bucket of variantBuckets) {
    await prisma.variantBucket.create({
      data: {
        ...bucket,
        gt: bucket.gt ? new Prisma.Decimal(bucket.gt) : null,
        lte: bucket.lte ? new Prisma.Decimal(bucket.lte) : null,
      },
    });
  }

  // --- 6. Seed Products ---
  console.log(`Đang seed Products...`);
  await prisma.product.createMany({ data: productsToCreate });

  // --- 7. Seed Product Spec Values ---
  console.log(`Đang seed ProductSpecValues...`);
  await prisma.productSpecValue.createMany({ data: productSpecValuesToCreate });

  // --- 8. Seed Media (Tạo tất cả ảnh trước) ---
  console.log(`Đang seed Media...`);
  await prisma.media.createMany({ data: MediaArray });

  // --- 9. Seed Variants (Tạo tất cả biến thể) ---
  console.log(`Đang seed Variants...`);
  await prisma.variant.createMany({
    data: variantsToCreate.map((v) => ({
      productId: v.productId,
      color: v.color || "Default",
      price: new Prisma.Decimal(v.price),
      compareAtPrice: v.compareAtPrice
        ? new Prisma.Decimal(v.compareAtPrice)
        : null,
      stock: v.stock,
      isActive: v.isActive,
      lowStockThreshold: v.lowStockThreshold,
    })),
  });

  // --- 10. Seed Variant Spec Values ---
  console.log(`Đang seed VariantSpecValues...`);
  await prisma.variantSpecValue.createMany({ data: variantSpecValuesToCreate });

  // --- 11. Seed MediaVariant (Tạo liên kết giữa Media và Variant) ---
  console.log(`Đang seed MediaVariant...`);
  await prisma.mediaVariant.createMany({
    data: MediaVariant, // Dùng trực tiếp mảng JSON bạn đã tạo
  });

  console.log(`✅ Quá trình seeding hoàn tất.`);
}

main()
  .catch((e) => {
    console.error("❌ Đã xảy ra lỗi trong quá trình seeding:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Đảm bảo ngắt kết nối Prisma Client
    await prisma.$disconnect();
  });
