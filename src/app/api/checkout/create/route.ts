// app/api/checkout/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  PrismaClient,
  InventoryTxnType,
  DeviceStatus,
  PaymentTxnStatus,
  PaymentStatus,
  OrderStatus,
} from "@prisma/client";
import { verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

// Custom error riêng cho coupon
class CouponError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CouponError";
  }
}

// Kiểu dữ liệu request body (khớp với bên frontend bạn đang gửi)
type CheckoutItemPayload = {
  variantId: number;
  quantity: number;
  price: number;
  nameSnapshot: string;
};

type CheckoutBody = {
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  addressSnapshot: any;
  items: CheckoutItemPayload[];
  paymentMethodId: number;
  note?: string;
  couponCode?: string;
  paymentMeta?: {
    idempotencyKey: string;
    qrUrl?: string;
    orderCode?: string;
  };
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CheckoutBody;
    const {
      subtotal,
      shippingFee,
      discount,
      total,
      addressSnapshot,
      items,
      paymentMethodId,
      note,
      couponCode,
      paymentMeta,
    } = body;

    // TODO: Lấy userId từ auth của bạn (next-auth, JWT, custom,...)
    // Ví dụ với next-auth:
    // const session = await auth();
    // const userId = session?.user?.id;
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: Vui lòng đăng nhập" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json(
        { message: "Unauthorized: Token không hợp lệ" },
        { status: 401 }
      );
    }

    const userId = Number(payload.id);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Giỏ hàng trống" }, { status: 400 });
    }

    // Một chút validate đơn giản
    if (total <= 0 || subtotal <= 0) {
      return NextResponse.json(
        { error: "Tổng tiền không hợp lệ" },
        { status: 400 }
      );
    }

    // Thời điểm hiện tại dùng cho validate coupon
    const now = new Date();

    const result = await prisma.$transaction(async (tx) => {
      // 1. Validate & chuẩn bị dữ liệu coupon (nếu có)
      let coupon = null as Awaited<
        ReturnType<typeof tx.coupon.findUnique>
      > | null;

      if (couponCode) {
        coupon = await tx.coupon.findUnique({
          where: { code: couponCode },
        });

        if (!coupon || coupon.status !== "active") {
          throw new CouponError("Mã giảm giá không tồn tại hoặc đã bị khóa");
        }

        if (coupon.startsAt && now < coupon.startsAt) {
          throw new CouponError("Mã giảm giá chưa bắt đầu");
        }

        if (coupon.endsAt && now > coupon.endsAt) {
          throw new CouponError("Mã giảm giá đã hết hạn");
        }

        if (
          coupon.usageLimit !== null &&
          typeof coupon.usageLimit !== "undefined" &&
          coupon.used >= coupon.usageLimit
        ) {
          throw new CouponError("Mã giảm giá đã hết lượt sử dụng");
        }

        if (subtotal < Number(coupon.minOrder || 0)) {
          throw new CouponError(
            `Đơn hàng chưa đạt giá trị tối thiểu để áp dụng mã`
          );
        }

        // TODO nếu bạn có logic ràng buộc theo brand/category
        // thì check items + variant + product ở đây
      }

      // 2. Chuẩn bị lấy paymentMethod & paymentAccount (nếu cần)
      const paymentMethod = await tx.paymentMethod.findUnique({
        where: { id: paymentMethodId },
        include: { accounts: true },
      });

      if (!paymentMethod || !paymentMethod.isActive) {
        throw new Error("Phương thức thanh toán không hợp lệ");
      }

      // Chọn 1 account active (nếu có) để map vào Order.paymentAccountId
      const defaultAccount = paymentMethod.accounts.find((a) => a.isActive);

      // Tạo mã đơn hàng đơn giản
      const orderCode = `ORD-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)
        .toUpperCase()}`;

      // 3. Tạo Order
      const order = await tx.order.create({
        data: {
          userId,
          code: orderCode,
          status: OrderStatus.pending,
          paymentStatus: PaymentStatus.pending,
          paymentAccountId: defaultAccount?.id ?? null,
          subtotal,
          shippingFee,
          discount,
          total,
          addressSnapshot,
          note: note || null,
        },
      });

      // 4. Tạo OrderItems + OrderDevices + cập nhật stock + InventoryTransaction
      for (const item of items) {
        const qty = Number(item.quantity) || 0;
        if (!item.variantId || qty <= 0) {
          throw new Error("Dữ liệu sản phẩm không hợp lệ");
        }

        const variant = await tx.variant.findUnique({
          where: { id: item.variantId },
          select: {
            id: true,
            stock: true,
            productId: true,
          },
        });

        if (!variant) {
          throw new Error("Variant không tồn tại");
        }

        if (variant.stock < qty) {
          throw new Error(
            `Sản phẩm đã hết hàng hoặc không đủ số lượng (variantId: ${variant.id})`
          );
        }

        // 4.1. Tạo OrderItem
        const orderItem = await tx.orderItem.create({
          data: {
            orderId: order.id,
            variantId: item.variantId,
            price: item.price,
            quantity: qty,
            nameSnapshot: item.nameSnapshot,
          },
        });

        // 4.2. Nếu có Device cho variant này => gán device vào order (OrderDevice)
        // Lấy đúng số lượng device đang in_stock
        const devices = await tx.device.findMany({
          where: {
            variantId: item.variantId,
            status: DeviceStatus.in_stock,
          },
          take: qty,
          orderBy: { id: "asc" },
        });

        // Nếu bạn muốn BẮT BUỘC phải đủ device thì bỏ if này
        if (devices.length < qty) {
          // Có thể throw lỗi hoặc cho phép thiếu
          throw new Error(
            `Không đủ thiết bị (Device) cho variantId=${item.variantId}`
          );
        }

        for (const device of devices) {
          // Tạo mapping OrderDevice
          await tx.orderDevice.create({
            data: {
              orderItemId: orderItem.id,
              deviceId: device.id,
            },
          });

          // Cập nhật trạng thái device thành sold
          await tx.device.update({
            where: { id: device.id },
            data: { status: DeviceStatus.sold },
          });
        }

        // 4.3. Giảm stock của Variant
        await tx.variant.update({
          where: { id: variant.id },
          data: {
            stock: {
              decrement: qty,
            },
          },
        });

        // 4.4. Ghi log InventoryTransaction (type: out)
        await tx.inventoryTransaction.create({
          data: {
            variantId: variant.id,
            type: InventoryTxnType.out,
            quantity: qty,
            reason: `Bán hàng cho đơn ${order.code}`,
            referenceJson: {
              orderId: order.id,
              orderItemId: orderItem.id,
            } as any,
            createdBy: null, // nếu có staff xử lý thì set id staff
          },
        });

        // 5. (OPTIONAL) cập nhật số lượt mua sp
        // Hiện trong schema chưa có cột purchaseCount.
        // Nếu bạn thêm cột ví dụ Product.purchasedCount thì:
        //
        // await tx.product.update({
        //   where: { id: variant.productId },
        //   data: {
        //     purchasedCount: { increment: qty },
        //   },
        // });
      }

      // 6. Tạo PaymentTransaction
      let providerPaymentId: string | null = null;

      if (paymentMeta?.orderCode) {
        providerPaymentId = paymentMeta.orderCode;
      }

      // Với COD, status vẫn là pending.
      // Với thanh toán online, bạn có thể set success sau khi webhook báo về.
      await tx.paymentTransaction.create({
        data: {
          orderId: order.id,
          paymentMethodId,
          providerPaymentId,
          amount: total,
          status: PaymentTxnStatus.pending,
        },
      });

      // 7. Cập nhật Coupon.used (nếu có)
      if (coupon) {
        await tx.coupon.update({
          where: { id: coupon.id },
          data: {
            used: {
              increment: 1,
            },
          },
        });
      }

      // 👉 Có thể trả order code / id về cho FE
      return {
        orderId: order.id,
        orderCode: order.code,
      };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error("checkout/create error:", err);

    // Lỗi coupon -> trả về đúng format FE đang dùng: { reason }
    if (err instanceof CouponError) {
      return NextResponse.json(
        {
          error: "Coupon error",
          reason: err.message,
        },
        { status: 400 }
      );
    }

    // Các lỗi khác
    return NextResponse.json(
      {
        error: err?.message || "Đặt hàng thất bại, vui lòng thử lại sau",
      },
      { status: 500 }
    );
  }
}
