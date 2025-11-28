// npx tsx scripts/generate-fake-orders.ts
import {
  PrismaClient,
  OrderStatus,
  PaymentStatus,
  PaymentTxnStatus,
  InventoryTxnType,
  DeviceStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

const ORDER_COUNT = 50; // muốn ít hơn thì giảm số này

// ---------------- helpers ----------------

function randomInt(min: number, max: number): number {
  // cả hai đầu đều inclusive
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// random ngày trong vòng N tháng gần đây
function randomDateInLastMonths(months: number): Date {
  const now = new Date();
  const past = new Date();
  past.setMonth(past.getMonth() - months);

  const t =
    past.getTime() + Math.random() * (now.getTime() - past.getTime());

  return new Date(t);
}

function buildAddressSnapshot(user: any): any {
  const addr = user.addresses?.[0];

  if (addr) {
    return {
      line: addr.line,
      phone: addr.phone ?? "0900000000",
      ward: addr.ward ?? "Phường 1",
      district: addr.district ?? "Quận 1",
      province: addr.province ?? "TP.HCM",
      receiverName: user.name ?? "Khách hàng",
    };
  }

  // fallback, nếu user chưa có address
  return {
    line: "123 Đường Demo",
    phone: "0900000000",
    ward: "Phường 1",
    district: "Quận 1",
    province: "TP.HCM",
    receiverName: user.name ?? "Khách hàng",
  };
}

// Xác định trạng thái order / payment “thật thật”
function pickOrderState(createdAt: Date) {
  const r = Math.random();

  // ~60% đơn đã hoàn thành & đã thanh toán
  if (r < 0.6) {
    const paidAt = new Date(
      createdAt.getTime() + 1000 * 60 * randomInt(5, 120)
    );

    return {
      orderStatus: randomChoice([
        OrderStatus.delivered,
        OrderStatus.completed,
      ]),
      paymentStatus: PaymentStatus.paid,
      paymentTxnStatus: PaymentTxnStatus.success,
      paidAt,
      shippingProvider: randomChoice(["GHN", "GHTK", "VNPost"]),
      shippingStatus: "delivered",
      note: "Đơn hàng đã giao thành công",
    };
  }

  // ~20% đơn đang chờ / đang xử lý
  if (r < 0.8) {
    return {
      orderStatus: randomChoice([
        OrderStatus.pending,
        OrderStatus.confirmed,
        OrderStatus.processing,
      ]),
      paymentStatus: PaymentStatus.pending,
      paymentTxnStatus: PaymentTxnStatus.pending,
      paidAt: null,
      shippingProvider: null,
      shippingStatus: null,
      note: "Đơn hàng đang được xử lý",
    };
  }

  // ~20% đơn bị hủy / thất bại
  const cancelledStatus = randomChoice([
    OrderStatus.cancelled,
    OrderStatus.refunded,
  ]);

  const paymentStatus =
    cancelledStatus === OrderStatus.refunded
      ? PaymentStatus.paid
      : PaymentStatus.failed;

  const paymentTxnStatus =
    cancelledStatus === OrderStatus.refunded
      ? PaymentTxnStatus.refunded
      : PaymentTxnStatus.failed;

  return {
    orderStatus: cancelledStatus,
    paymentStatus,
    paymentTxnStatus,
    paidAt: null,
    shippingProvider: null,
    shippingStatus: null,
    note:
      cancelledStatus === OrderStatus.refunded
        ? "Đơn hàng đã được hoàn tiền"
        : "Đơn hàng bị hủy bởi khách hoặc hệ thống",
  };
}

function generateOrderCode(index: number, createdAt: Date): string {
  const y = createdAt.getFullYear();
  const m = String(createdAt.getMonth() + 1).padStart(2, "0");
  const d = String(createdAt.getDate()).padStart(2, "0");
  return `ORD-${y}${m}${d}-${String(index + 1).padStart(4, "0")}`;
}

// ---------------- main logic ----------------

async function main() {
  console.log("👉 Bắt đầu generate fake orders...");

  const users = await prisma.user.findMany({
    include: { addresses: true },
  });
  if (users.length === 0) {
    console.error("❌ Không có user nào trong DB. Hãy seed users trước.");
    return;
  }

  const paymentMethods = await prisma.paymentMethod.findMany({
    where: { isActive: true },
    include: { accounts: true },
  });

  if (paymentMethods.length === 0) {
    console.error(
      "❌ Không có paymentMethod nào trong DB. Hãy seed payment trước."
    );
    return;
  }

  for (let i = 0; i < ORDER_COUNT; i++) {
    try {
      await prisma.$transaction(async (tx) => {
        const user = randomChoice(users);
        const createdAt = randomDateInLastMonths(3); // 8 tháng gần đây
        const {
          orderStatus,
          paymentStatus,
          paymentTxnStatus,
          paidAt,
          shippingProvider,
          shippingStatus,
          note,
        } = pickOrderState(createdAt);

        const orderCode = generateOrderCode(i, createdAt);

        // ----------- chọn item cho đơn hàng -----------

        // Lấy danh sách variant còn hàng
        let variants = await tx.variant.findMany({
          where: {
            stock: { gt: 0 },
            isActive: true,
          },
          include: { product: true },
        });

        if (variants.length === 0) {
          throw new Error("Hết variant còn hàng để tạo order.");
        }

        const itemCount = randomInt(1, Math.min(3, variants.length));
        const chosenItems: {
          variantId: number;
          quantity: number;
          price: number;
          nameSnapshot: string;
        }[] = [];

        // clone list để chọn không trùng variant trong cùng 1 order
        const pool = [...variants];

        while (
          chosenItems.length < itemCount &&
          pool.length > 0
        ) {
          const v = randomChoice(pool);
          const maxQty = Math.min(2, v.stock); // mỗi item tối đa 2 cái
          if (maxQty <= 0) {
            // loại khỏi pool
            const idx = pool.findIndex((x) => x.id === v.id);
            if (idx >= 0) pool.splice(idx, 1);
            continue;
          }

          const qty = randomInt(1, maxQty);

          chosenItems.push({
            variantId: v.id,
            quantity: qty,
            price: Number(v.price ?? 0),
            nameSnapshot: `${v.product.name} - ${v.color}`,
          });

          // loại variant này khỏi pool để không chọn trùng
          const idx = pool.findIndex((x) => x.id === v.id);
          if (idx >= 0) pool.splice(idx, 1);
        }

        if (chosenItems.length === 0) {
          throw new Error("Không chọn được variant nào còn hàng.");
        }

        // ----------- tính tiền -----------

        const subtotal = chosenItems.reduce(
          (sum, it) => sum + it.price * it.quantity,
          0
        );

        // phí ship: có lúc free, có lúc 30k
        const shippingFee = Math.random() < 0.5 ? 0 : 30000;

        // discount nhẹ nhẹ cho đẹp
        let discount = 0;
        if (subtotal > 10_000_000 && Math.random() < 0.4) {
          discount = randomInt(50_000, 300_000);
        }

        const total = subtotal + shippingFee - discount;

        // ----------- chọn phương thức thanh toán -----------

        const paymentMethod = randomChoice(paymentMethods);
        const defaultAccount =
          paymentMethod.accounts.find((a) => a.isActive) ??
          paymentMethod.accounts[0] ??
          null;

        // ----------- tạo Order -----------

        const order = await tx.order.create({
          data: {
            userId: user.id,
            code: orderCode,
            status: orderStatus,
            paymentStatus,
            paymentAccountId: defaultAccount?.id ?? null,
            subtotal,
            shippingFee,
            discount,
            total,
            addressSnapshot: buildAddressSnapshot(user),
            createdAt,
            paidAt,
            note,
            shippingProvider,
            shippingStatus,
          },
        });

        // ----------- tạo OrderItem + OrderDevice + InventoryTransaction -----------

        for (const item of chosenItems) {
          const variant = await tx.variant.findUnique({
            where: { id: item.variantId },
            include: { product: true },
          });

          if (!variant) {
            throw new Error(
              `Variant ${item.variantId} không tồn tại.`
            );
          }

          if (variant.stock < item.quantity) {
            throw new Error(
              `Variant ${variant.id} không đủ stock (còn ${variant.stock}, cần ${item.quantity}).`
            );
          }

          const orderItem = await tx.orderItem.create({
            data: {
              orderId: order.id,
              variantId: variant.id,
              price: item.price,
              quantity: item.quantity,
              nameSnapshot: item.nameSnapshot,
            },
          });

          // Lấy device đang in_stock
          const devices = await tx.device.findMany({
            where: {
              variantId: variant.id,
              status: DeviceStatus.in_stock,
            },
            take: item.quantity,
            orderBy: { id: "asc" },
          });

          if (devices.length < item.quantity) {
            throw new Error(
              `Không đủ Device cho variantId=${variant.id}.`
            );
          }

          for (const device of devices) {
            // map OrderDevice
            await tx.orderDevice.create({
              data: {
                orderItemId: orderItem.id,
                deviceId: device.id,
              },
            });

            // update device -> sold
            await tx.device.update({
              where: { id: device.id },
              data: { status: DeviceStatus.sold },
            });
          }

          // trừ stock variant
          await tx.variant.update({
            where: { id: variant.id },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });

          // ghi inventory transaction (type: out)
          await tx.inventoryTransaction.create({
            data: {
              variantId: variant.id,
              type: InventoryTxnType.out,
              quantity: item.quantity,
              reason: `Bán hàng seed order ${order.code}`,
              referenceJson: {
                orderId: order.id,
                orderItemId: orderItem.id,
              } as any,
              createdBy: null,
              createdAt,
            },
          });
        }

        // ----------- tạo PaymentTransaction -----------

        let providerPaymentId: string | null = null;
        if (paymentTxnStatus === PaymentTxnStatus.success) {
          providerPaymentId = `${paymentMethod.code.toUpperCase()}-${order.code}`;
        } else if (paymentTxnStatus === PaymentTxnStatus.failed) {
          providerPaymentId = `${paymentMethod.code.toUpperCase()}-${order.code}-FAIL`;
        } else if (paymentTxnStatus === PaymentTxnStatus.refunded) {
          providerPaymentId = `${paymentMethod.code.toUpperCase()}-${order.code}-REFUND`;
        }

        await tx.paymentTransaction.create({
          data: {
            orderId: order.id,
            paymentMethodId: paymentMethod.id,
            providerPaymentId,
            amount: total,
            status: paymentTxnStatus,
            createdAt,
          },
        });

        console.log(
          `✅ Tạo order ${order.code} cho user #${user.id} (${chosenItems.length} item).`
        );
      });
    } catch (err) {
      console.error(`❌ Lỗi khi tạo order index=${i}:`, err);
      // nếu lỗi do hết stock/device thì dừng luôn cho khỏi lỗi tiếp
      break;
    }
  }

  console.log("✅ Hoàn tất generate fake orders.");
}

main()
  .catch((e) => {
    console.error("❌ Script lỗi:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
