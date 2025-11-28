// npx tsx scripts/sync-inventory-from-devices.ts
import { PrismaClient, InventoryTxnType, DeviceStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Sync inventory from existing devices...");

  const variants = await prisma.variant.findMany();

  for (const variant of variants) {
    // Lấy devices đang có sẵn trong DB
    const devices = await prisma.device.findMany({
      where: {
        variantId: variant.id,
        status: DeviceStatus.in_stock,
      }
    });

    const quantity = devices.length;

    if (quantity === 0) {
      console.log(`⚠ Variant #${variant.id} không có device, bỏ qua.`);
      continue;
    }

    // 1. Tạo inventory transaction ghi nhận nhập kho ban đầu
    const txn = await prisma.inventoryTransaction.create({
      data: {
        variantId: variant.id,
        type: InventoryTxnType.in,
        quantity,
        reason: "Initial sync from device table"
      }
    });

    // 2. Link từng device vào transaction
    await prisma.inventoryTransactionDevice.createMany({
      data: devices.map(d => ({
        inventoryTxnId: txn.id,
        deviceId: d.id
      }))
    });

    // 3. Cập nhật tồn kho của variant
    await prisma.variant.update({
      where: { id: variant.id },
      data: {
        stock: quantity
      }
    });

    console.log(`✔ Variant #${variant.id}: synced ${quantity} devices.`);
  }

  console.log("🎉 DONE Sync inventory!");
}

main().finally(() => prisma.$disconnect());
