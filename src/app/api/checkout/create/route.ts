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

// Helper sinh mã phiếu kho (giống logic bên inventory)
async function generateTicketCode(type: string, tx: any): Promise<string> {
  const prefix = type === "in" ? "IN" : type === "out" ? "OUT" : "AUDIT";

  // Đếm số lượng phiếu hiện có để tạo số tiếp theo
  const count = await tx.inventoryTicket.count({
    where: { type: type as any },
  });

  const nextNumber = (count + 1).toString().padStart(4, "0");
  return `${prefix}${nextNumber}`;
}

// Kiểu dữ liệu request body
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

    // --- 1. AUTHENTICATION ---
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

    // --- 2. BASIC VALIDATION ---
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Giỏ hàng trống" }, { status: 400 });
    }

    if (total <= 0 || subtotal <= 0) {
      return NextResponse.json(
        { error: "Tổng tiền không hợp lệ" },
        { status: 400 }
      );
    }

    const now = new Date();

    // --- 3. TRANSACTION START ---
    const result = await prisma.$transaction(async (tx) => {
      // 3.1. Validate Coupon
      let coupon = null;
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
          coupon.used >= coupon.usageLimit
        ) {
          throw new CouponError("Mã giảm giá đã hết lượt sử dụng");
        }
        if (subtotal < Number(coupon.minOrder || 0)) {
          throw new CouponError("Đơn hàng chưa đạt giá trị tối thiểu");
        }
      }

      // 3.2. Get Payment Method
      const paymentMethod = await tx.paymentMethod.findUnique({
        where: { id: paymentMethodId },
        include: { accounts: true },
      });

      if (!paymentMethod || !paymentMethod.isActive) {
        throw new Error("Phương thức thanh toán không hợp lệ");
      }
      const defaultAccount = paymentMethod.accounts.find((a) => a.isActive);

      // 3.3. Create Order
      const orderCode = `ORD-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)
        .toUpperCase()}`;

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

      // --- 4. INVENTORY PROCESSING (NEW LOGIC) ---
      
      // A. Tạo 1 Phiếu xuất kho (InventoryTicket) cho toàn bộ đơn hàng
      const ticketCode = await generateTicketCode("out", tx);
      const inventoryTicket = await tx.inventoryTicket.create({
        data: {
          code: ticketCode,
          type: InventoryTxnType.out, 
          status: "COMPLETED",
          note: `Xuất kho tự động cho đơn hàng ${orderCode}`,
          createdBy: null, 
        },
      });

      // B. Xử lý từng item
      for (const item of items) {
        const qty = Number(item.quantity) || 0;
        if (!item.variantId || qty <= 0) {
          throw new Error("Dữ liệu sản phẩm không hợp lệ");
        }

        const variant = await tx.variant.findUnique({
          where: { id: item.variantId },
          select: { id: true, stock: true },
        });

        if (!variant) throw new Error("Variant không tồn tại");
        if (variant.stock < qty) {
          throw new Error(`Sản phẩm hết hàng (variantId: ${variant.id})`);
        }

        // B.1. Tạo OrderItem
        const orderItem = await tx.orderItem.create({
          data: {
            orderId: order.id,
            variantId: item.variantId,
            price: item.price,
            quantity: qty,
            nameSnapshot: item.nameSnapshot,
          },
        });

        // B.2. Tìm Device (Serial/IMEI) phù hợp để xuất
        const devices = await tx.device.findMany({
          where: {
            variantId: item.variantId,
            status: DeviceStatus.in_stock,
          },
          take: qty,
          orderBy: { createdAt: "asc" }, 
        });

        if (devices.length < qty) {
          throw new Error(
            `Không đủ thiết bị (Device) khả dụng cho sản phẩm ${item.nameSnapshot}`
          );
        }

        // B.3. Cập nhật Device status & Tạo OrderDevice
        for (const device of devices) {
          // Link vào Order
          await tx.orderDevice.create({
            data: {
              orderItemId: orderItem.id,
              deviceId: device.id,
            },
          });

          // Update status thành sold
          await tx.device.update({
            where: { id: device.id },
            data: { status: DeviceStatus.sold },
          });
        }

        // B.4. Trừ tồn kho Variant
        await tx.variant.update({
          where: { id: variant.id },
          data: { stock: { decrement: qty } },
        });

        // B.5. Tạo InventoryTransaction & Link Devices
        await tx.inventoryTransaction.create({
          data: {
            ticketId: inventoryTicket.id,
            variantId: item.variantId,
            quantity: qty,
            // Lưu danh sách device cụ thể vào giao dịch kho
            devices: {
              create: devices.map((d) => ({
                device: { connect: { id: d.id } },
              })),
            },
          },
        });
      }

      // --- 5. FINALIZE ---

      // Tạo PaymentTransaction
      let providerPaymentId: string | null = null;
      if (paymentMeta?.orderCode) {
        providerPaymentId = paymentMeta.orderCode;
      }

      await tx.paymentTransaction.create({
        data: {
          orderId: order.id,
          paymentMethodId,
          providerPaymentId,
          amount: total,
          status: PaymentTxnStatus.pending,
        },
      });

      // Update Coupon usage
      if (coupon) {
        await tx.coupon.update({
          where: { id: coupon.id },
          data: { used: { increment: 1 } },
        });
      }

      return {
        orderId: order.id,
        orderCode: order.code,
      };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error("checkout/create error:", err);
    
    if (err instanceof CouponError) {
      return NextResponse.json(
        { error: "Coupon error", reason: err.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: err?.message || "Đặt hàng thất bại, vui lòng thử lại sau" },
      { status: 500 }
    );
  }
}