// Xóa prisma/migrations
// npx prisma migrate dev --name init
// npx prisma migrate reset --force

/*
  Sửa dữ liệu trong schema.prisma
  npx prisma migrate dev --name ten_moi
 -> để cập nhật migrations

  Chạy seed (nếu có thay đổi dữ liệu seed thì mới chạy lệnh này , nó vẫn giữ nguyên dữ liệu cũ trong db):
  npx prisma db seed
*/
import { PrismaClient, Prisma } from "@prisma/client";

// ---------- IMPORT DỮ LIỆU SEED ----------
import { specTemplates } from "./seeds/Seed Spectemplate/seed-specTemplate";
import { productBuckets } from "./seeds/Seed Spectemplate/seed-productBucket";
import { productSpecs } from "./seeds/Seed Spectemplate/seed-productSpec";
import { productSpecOptions } from "./seeds/Seed Spectemplate/seed-productSpecOption";
import { variantBuckets } from "./seeds/Seed Spectemplate/seed-variantBucket";
import { variantSpecs } from "./seeds/Seed Spectemplate/seed-variantSpec";
import { variantSpecOptions } from "./seeds/Seed Spectemplate/seed-variantSpecOption";

import { banners } from "./seeds/seed-banners";
import { brands } from "./seeds/seed-brands";
import { categories } from "./seeds/seed-categories";
import { media } from "./seeds/seed-media";
import { MediaVariant } from "./seeds/seed-mediaVariant";
import { paymentMethods, paymentAccounts } from "./seeds/seed-payment";
import { products } from "./seeds/seed-products";
import { productSpecValues } from "./seeds/seed-productSpecValue";
import { variants } from "./seeds/seed-variants";
import { variantSpecValues } from "./seeds/seed-variantSpecValue";
import { devices } from "./seeds/seed-devices"; // 👈 THÊM DÒNG NÀY

import {
  coupons,
  permissions,
  rolePermissions,
  roles,
  staffRoles,
  staffs,
  users,
  reviews,
} from "./seedData";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Bắt đầu quá trình seeding...");

  // =====================================================
  // 1. XÓA DỮ LIỆU CŨ (THEO THỨ TỰ FKs)
  // =====================================================
  console.log("🗑️ Đang xóa dữ liệu cũ...");

  // Các bảng “đuôi” của Order / Device / Inventory
  await prisma.orderDevice.deleteMany().catch(() => {});
  await prisma.device.deleteMany().catch(() => {});
  await prisma.inventoryTransaction.deleteMany().catch(() => {});
  await prisma.paymentTransaction.deleteMany().catch(() => {});
  await prisma.rma.deleteMany().catch(() => {});
  await prisma.orderItem.deleteMany().catch(() => {});
  await prisma.order.deleteMany().catch(() => {});

  // Cart
  await prisma.cartItem.deleteMany().catch(() => {});
  await prisma.cart.deleteMany().catch(() => {});

  // Review
  await prisma.review.deleteMany().catch(() => {});

  // Media & Variant
  await prisma.mediaVariant.deleteMany().catch(() => {});
  await prisma.media.deleteMany().catch(() => {});

  await prisma.variantSpecValue.deleteMany().catch(() => {});
  await prisma.variant.deleteMany().catch(() => {});

  // Product spec values & product
  await prisma.productSpecValue.deleteMany().catch(() => {});
  await prisma.product.deleteMany().catch(() => {});

  // Variant spec/bucket/option
  await prisma.variantBucket.deleteMany().catch(() => {});
  await prisma.variantSpecOption.deleteMany().catch(() => {});
  await prisma.variantSpec.deleteMany().catch(() => {});

  // Product spec/bucket/option
  await prisma.productBucket.deleteMany().catch(() => {});
  await prisma.productSpecOption.deleteMany().catch(() => {});
  await prisma.productSpec.deleteMany().catch(() => {});

  await prisma.specTemplate.deleteMany().catch(() => {});

  // Banner, Coupon
  await prisma.banner.deleteMany().catch(() => {});
  await prisma.coupon.deleteMany().catch(() => {});

  // Payment
  await prisma.paymentAccount.deleteMany().catch(() => {});
  await prisma.paymentMethod.deleteMany().catch(() => {});

  // Staff / Role / Permission
  await prisma.staffRole.deleteMany().catch(() => {});
  await prisma.rolePermission.deleteMany().catch(() => {});
  await prisma.staff.deleteMany().catch(() => {});
  await prisma.role.deleteMany().catch(() => {});
  await prisma.permission.deleteMany().catch(() => {});

  // User & Address
  await prisma.address.deleteMany().catch(() => {});
  await prisma.user.deleteMany().catch(() => {});

  // Brand / Category
  await prisma.brand.deleteMany().catch(() => {});
  await prisma.category.deleteMany().catch(() => {});

  console.log("✅ Đã xóa xong dữ liệu cũ.");

  // =====================================================
  // 2. DANH MỤC, THƯƠNG HIỆU, PAYMENT METHOD/ACCOUNT
  // =====================================================

  console.log("📦 Seeding Categories...");
  await prisma.category.createMany({
    data: categories,
  });

  console.log("🏷️ Seeding Brands...");
  await prisma.brand.createMany({
    data: brands,
  });

  console.log("💳 Seeding PaymentMethods...");
  await prisma.paymentMethod.createMany({
    data: paymentMethods,
  });

  console.log("🏦 Seeding PaymentAccounts...");
  await prisma.paymentAccount.createMany({
    data: paymentAccounts,
  });

  // =====================================================
  // 3. SPEC TEMPLATES / PRODUCT SPECS / BUCKETS
  // =====================================================

  console.log("📘 Seeding SpecTemplates...");
  await prisma.specTemplate.createMany({
    data: specTemplates,
  });

  console.log("📘 Seeding ProductSpecs...");
  await prisma.productSpec.createMany({
    data: productSpecs as Prisma.ProductSpecCreateManyInput[],
  });

  console.log("📘 Seeding ProductSpecOptions...");
  await prisma.productSpecOption.createMany({
    data: productSpecOptions as Prisma.ProductSpecOptionCreateManyInput[],
  });

  console.log("📘 Seeding ProductBuckets...");
  for (const bucket of productBuckets) {
    await prisma.productBucket.create({
      data: {
        ...bucket,
        gt: bucket.gt ? new Prisma.Decimal(bucket.gt) : null,
        lte: bucket.lte ? new Prisma.Decimal(bucket.lte) : null,
      },
    });
  }

  // =====================================================
  // 4. VARIANT SPECS / OPTIONS / BUCKETS
  // =====================================================

  console.log("🧩 Seeding VariantSpecs...");
  await prisma.variantSpec.createMany({
    data: variantSpecs as Prisma.VariantSpecCreateManyInput[],
  });

  console.log("🧩 Seeding VariantSpecOptions...");
  await prisma.variantSpecOption.createMany({
    data: variantSpecOptions as Prisma.VariantSpecOptionCreateManyInput[],
  });

  console.log("🧩 Seeding VariantBuckets...");
  for (const bucket of variantBuckets) {
    await prisma.variantBucket.create({
      data: {
        ...bucket,
        gt: bucket.gt ? new Prisma.Decimal(bucket.gt) : null,
        lte: bucket.lte ? new Prisma.Decimal(bucket.lte) : null,
      },
    });
  }

  // =====================================================
  // 5. PRODUCTS & PRODUCT SPEC VALUES
  // =====================================================

  console.log("📦 Seeding Products...");
  await prisma.product.createMany({
    data: products as Prisma.ProductCreateManyInput[],
  });

  console.log("📦 Seeding ProductSpecValues...");
  // Bỏ id để tránh trùng PK, để DB tự autoincrement
  await prisma.productSpecValue.createMany({
    data: productSpecValues.map(({ id, ...rest }) => ({
      ...rest,
    })) as Prisma.ProductSpecValueCreateManyInput[],
  });

  // =====================================================
  // 6. MEDIA, VARIANTS, VARIANT SPEC VALUES, MEDIA-VARIANT, DEVICES
  // =====================================================

  console.log("🖼️ Seeding Media...");
  await prisma.media.createMany({
    data: media as Prisma.MediaCreateManyInput[],
  });

  console.log("🎨 Seeding Variants...");
  await prisma.variant.createMany({
    data: variants as Prisma.VariantCreateManyInput[],
  });

  // 👉 SEED DEVICES TỪ FILE seed-devices
  console.log("📱 Seeding Devices...");
  await prisma.device.createMany({
    data: devices as Prisma.DeviceCreateManyInput[],
  });

  console.log("🎨 Seeding VariantSpecValues...");
  // Bỏ id để tránh trùng PK
  await prisma.variantSpecValue.createMany({
    data: variantSpecValues.map(({ id, ...rest }) => ({
      ...rest,
    })) as Prisma.VariantSpecValueCreateManyInput[],
  });

  console.log("🔗 Seeding MediaVariant...");
  await prisma.mediaVariant.createMany({
    data: MediaVariant as Prisma.MediaVariantCreateManyInput[],
  });

  // =====================================================
  // 7. BANNERS (PHẢI SAU KHI PRODUCTS ĐÃ CÓ)
  // =====================================================

  console.log("🖼️ Seeding Banners...");
  await prisma.banner.createMany({
    data: banners,
  });

  // =====================================================
  // 8. USERS + ADDRESSES
  // =====================================================

  console.log("👤 Seeding Users...");
  for (const user of users) {
    await prisma.user.create({
      data: {
        email: user.email,
        passwordHash: user.passwordHash,
        name: user.name,
        avatar: user.avatar,
        status: user.status,
        createdAt: user.createdAt,
        addresses: user.addresses
          ? {
              create: user.addresses,
            }
          : undefined,
      },
    });
  }

  // =====================================================
  // 9. COUPONS
  // =====================================================

  console.log("💸 Seeding Coupons...");
  for (const coupon of coupons) {
    await prisma.coupon.create({
      data: {
        code: coupon.code,
        type: coupon.type,
        value: new Prisma.Decimal(coupon.value),
        minOrder: new Prisma.Decimal(coupon.minOrder ?? 0),
        maxOrder:
          coupon.maxOrder === null || coupon.maxOrder === undefined
            ? null
            : new Prisma.Decimal(coupon.maxOrder),
        startsAt: coupon.startsAt ?? null,
        endsAt: coupon.endsAt ?? null,
        usageLimit: coupon.usageLimit ?? null,
        used: coupon.used ?? 0,
        status: coupon.status,
        categoryId: coupon.categoryId ?? null,
        brandId: coupon.brandId ?? null,
      },
    });
  }

  // =====================================================
  // 10. PERMISSIONS / ROLES / STAFFS
  // =====================================================

  console.log("🛡️ Seeding Permissions...");
  await prisma.permission.createMany({
    data: permissions,
    skipDuplicates: true,
  });

  console.log("🛡️ Seeding Roles...");
  await prisma.role.createMany({
    data: roles,
    skipDuplicates: true,
  });

  console.log("🛡️ Seeding RolePermissions...");
  await prisma.rolePermission.createMany({
    data: rolePermissions,
    skipDuplicates: true,
  });

  console.log("🧑‍💼 Seeding Staffs...");
  await prisma.staff.createMany({
    data: staffs.map((s) => ({
      email: s.email,
      passwordHash: s.passwordHash,
      name: s.name,
      avatar: s.avatar,
      status: s.status,
      createdAt: s.createdAt,
    })),
    skipDuplicates: true,
  });

  console.log("🧑‍💼 Seeding StaffRoles...");
  await prisma.staffRole.createMany({
    data: staffRoles,
    skipDuplicates: true,
  });

  // =====================================================
  // 11. REVIEWS
  // =====================================================

  console.log("⭐ Seeding Reviews...");
  await prisma.review.createMany({
    data: reviews,
    skipDuplicates: true,
  });

  console.log("🔄 Đang đồng bộ lại sequence (setval MAX(id)+1)...");

  await prisma.$executeRawUnsafe(`
DO $$
DECLARE
  rec record;
BEGIN
  FOR rec IN
    SELECT
      seq.relname       AS sequence_name,
      tbl.relname       AS table_name,
      col.attname       AS column_name
    FROM pg_class seq
    JOIN pg_depend d       ON d.objid = seq.oid AND seq.relkind = 'S'
    JOIN pg_class tbl      ON d.refobjid = tbl.oid AND tbl.relkind = 'r'
    JOIN pg_attribute col  ON col.attrelid = tbl.oid AND col.attnum = d.refobjsubid
  LOOP
    -- Set sequence = MAX(id)+1 cho cột đó
    EXECUTE format(
      'SELECT setval(%L, COALESCE(MAX(%I), 0) + 1, false) FROM %I',
      rec.sequence_name,
      rec.column_name,
      rec.table_name
    );
  END LOOP;
END $$;
`);

  console.log("✅ Đã đồng bộ sequence xong.");
  console.log("🎉 Quá trình seeding hoàn tất.");

  console.log("🎉 Quá trình seeding hoàn tất.");
}

main()
  .catch((e) => {
    console.error("❌ Đã xảy ra lỗi trong quá trình seeding:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
