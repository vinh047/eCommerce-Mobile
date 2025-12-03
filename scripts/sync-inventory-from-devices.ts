// npx tsx scripts/sync-inventory-from-devices.ts
import {
  PrismaClient,
  InventoryTxnType,
  DeviceStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

function buildTicketCode() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  return `INIT-SYNC-${y}${m}${d}-${hh}${mm}${ss}`;
}

async function main() {
  console.log("🔄 Sync inventory from existing devices...");

  // Tạo 1 phiếu nhập kho cho toàn bộ đợt sync
  const ticket = await prisma.inventoryTicket.create({
    data: {
      code: buildTicketCode(),
      type: InventoryTxnType.in, // nhập kho
      status: "COMPLETED",
      note: "Initial sync from device table",
      createdBy: null,
    },
  });

  console.log(`📄 Created inventory ticket: ${ticket.code}`);

  const variants = await prisma.variant.findMany();

  for (const variant of variants) {
    // Lấy devices đang in_stock cho variant này
    const devices = await prisma.device.findMany({
      where: {
        variantId: variant.id,
        status: DeviceStatus.in_stock,
      },
    });

    const quantity = devices.length;

    if (quantity === 0) {
      console.log(`⚠ Variant #${variant.id} không có device, bỏ qua.`);
      continue;
    }

    // 1. Tạo inventory transaction ghi nhận nhập kho ban đầu
    const txn = await prisma.inventoryTransaction.create({
      data: {
        ticketId: ticket.id,
        variantId: variant.id,
        quantity,
      },
    });

    // 2. Link từng device vào transaction
    await prisma.inventoryTransactionDevice.createMany({
      data: devices.map((d) => ({
        inventoryTxnId: txn.id,
        deviceId: d.id,
      })),
    });

    // 3. Cập nhật tồn kho của variant (override stock = số device đang in_stock)
    await prisma.variant.update({
      where: { id: variant.id },
      data: {
        stock: quantity,
      },
    });

    console.log(
      `✔ Variant #${variant.id}: synced ${quantity} devices (txn #${txn.id}).`
    );
  }

  console.log("🎉 DONE Sync inventory!");
}

main()
  .catch((e) => {
    console.error("❌ Script lỗi:", e);
  })
  .finally(() => prisma.$disconnect());
