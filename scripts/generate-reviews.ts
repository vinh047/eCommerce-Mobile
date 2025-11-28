// npx tsx scripts/generate-reviews.ts
import {
  PrismaClient,
  OrderStatus,
  PaymentStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

// Tỷ lệ % orderItem được tạo review
const REVIEW_PROBABILITY = 0.6; // 60%

// Giới hạn tối đa số review tạo thêm một lần chạy (để tránh lố)
const MAX_NEW_REVIEWS = 120;

// ------------- Helpers -------------

function randomInt(min: number, max: number): number {
  // inclusive cả min & max
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomRating(): number {
  const r = Math.random();
  if (r < 0.1) return 3; // 10%: 3 sao
  if (r < 0.02) return 2; // 2%: 2 sao
  if (r < 0.005) return 1; // 0.5%: 1 sao
  if (r < 0.4) return 4; // 30%: 4 sao
  return 5; // còn lại 57.5%: 5 sao
}

function randomReviewContent(
  stars: number,
  productName: string
): string {
  const good = [
    `Sản phẩm ${productName} dùng rất ổn, hiệu năng mượt mà, pin tốt.`,
    `Rất hài lòng với ${productName}, giao hàng nhanh, đóng gói cẩn thận.`,
    `${productName} chính hãng, chất lượng tốt, sẽ ủng hộ shop lần sau.`,
    `Đúng như mô tả, ${productName} hoạt động ổn định, không có lỗi gì.`,
    `Giá hợp lý so với chất lượng, ${productName} dùng ngon trong tầm giá.`,
  ];

  const normal = [
    `${productName} dùng được, không quá xuất sắc nhưng ổn với tầm giá.`,
    `Chất lượng bình thường, ${productName} đáp ứng nhu cầu cơ bản.`,
    `Hàng ổn, nhưng thời gian giao hơi lâu một chút.`,
  ];

  const bad = [
    `Sản phẩm ${productName} chưa được như mong đợi, hiệu năng hơi yếu.`,
    `Chưa hài lòng lắm về ${productName}, mong shop cải thiện.`,
    `Sản phẩm chưa đúng như kỳ vọng, cần thời gian dùng thêm để đánh giá.`,
  ];

  if (stars >= 5) return randomChoice(good);
  if (stars === 4) return randomChoice([...good, ...normal]);
  if (stars === 3) return randomChoice(normal);
  return randomChoice(bad);
}

// random time giữa 2 mốc
function randomDateBetween(from: Date, to: Date): Date {
  const t =
    from.getTime() + Math.random() * (to.getTime() - from.getTime());
  return new Date(t);
}

// ------------- MAIN -------------

async function main() {
  console.log("👉 Bắt đầu generate fake reviews...");

  // Lấy các orderItem thuộc đơn đã giao / hoàn tất & đã thanh toán
  const orderItems = await prisma.orderItem.findMany({
    where: {
      order: {
        status: {
          in: [OrderStatus.delivered, OrderStatus.completed],
        },
        paymentStatus: PaymentStatus.paid,
      },
    },
    include: {
      order: true,
      variant: {
        include: {
          product: true,
        },
      },
    },
  });

  if (orderItems.length === 0) {
    console.log(
      "⚠️ Không có orderItem nào thuộc đơn đã giao & đã thanh toán."
    );
    return;
  }

  console.log(`✅ Tìm thấy ${orderItems.length} orderItem đủ điều kiện.`);

  // Shuffle cho random
  const shuffled = [...orderItems].sort(() => Math.random() - 0.5);

  let createdCount = 0;
  const productIdsTouched = new Set<number>();

  for (const item of shuffled) {
    if (createdCount >= MAX_NEW_REVIEWS) {
      console.log(
        `⏹ Đã đạt MAX_NEW_REVIEWS = ${MAX_NEW_REVIEWS}, dừng.`
      );
      break;
    }

    // Random xem có tạo review cho orderItem này không
    if (Math.random() > REVIEW_PROBABILITY) continue;

    const userId = item.order.userId;
    const productId = item.variant.productId;
    const productName = item.variant.product.name;

    // Không tạo trùng review cho cùng user + product
    const existingReview = await prisma.review.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (existingReview) {
      // user này đã review product này rồi -> bỏ qua (cho realistic)
      continue;
    }

    const stars = randomRating();
    const content = randomReviewContent(stars, productName);

    const now = new Date();
    const reviewCreatedAt = randomDateBetween(
      item.order.createdAt,
      now
    );

    // 20% có ảnh (ảnh fake)
    const hasPhotos = Math.random() < 0.2;
    const photosJson = hasPhotos
      ? [
          `https://picsum.photos/seed/review-${
            item.id
          }-1/400/400`,
          `https://picsum.photos/seed/review-${
            item.id
          }-2/400/400`,
        ]
      : null;

    await prisma.review.create({
      data: {
        userId,
        productId,
        stars,
        content,
        photosJson: photosJson as any,
        createdAt: reviewCreatedAt,
        isActived: true,
      },
    });

    productIdsTouched.add(productId);
    createdCount++;

    console.log(
      `⭐ Tạo review ${stars}★ cho product #${productId} (${productName}) từ user #${userId}.`
    );
  }

  console.log(`✅ Đã tạo thêm ${createdCount} review.`);

  // Recalculate ratingAvg & ratingCount cho các product có review mới
  console.log("🔄 Đang cập nhật ratingAvg & ratingCount cho Product...");

  // Lấy agg cho tất cả product có review (hoặc chỉ productIdsTouched cũng được)
  const grouped = await prisma.review.groupBy({
    by: ["productId"],
    _avg: { stars: true },
    _count: { id: true },
  });

  for (const g of grouped) {
    const productId = g.productId;
    const ratingAvg = g._avg.stars ?? 0;
    const ratingCount = g._count.id;

    await prisma.product.update({
      where: { id: productId },
      data: {
        ratingAvg,
        ratingCount,
      },
    });

    if (productIdsTouched.has(productId)) {
      console.log(
        `📊 Product #${productId}: ratingAvg=${ratingAvg.toFixed(
          2
        )}, ratingCount=${ratingCount}`
      );
    }
  }

  console.log("✅ Hoàn tất generate reviews & cập nhật rating.");
}

main()
  .catch((err) => {
    console.error("❌ Script lỗi:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
