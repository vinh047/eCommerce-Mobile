/*
  Warnings:

  - You are about to drop the column `created_at` on the `inventory_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `inventory_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `inventory_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `reference_json` on the `inventory_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `inventory_transactions` table. All the data in the column will be lost.
  - Added the required column `ticket_id` to the `inventory_transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."inventory_transactions" DROP CONSTRAINT "inventory_transactions_created_by_fkey";

-- AlterTable
ALTER TABLE "inventory_transactions" DROP COLUMN "created_at",
DROP COLUMN "created_by",
DROP COLUMN "reason",
DROP COLUMN "reference_json",
DROP COLUMN "type",
ADD COLUMN     "ticket_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "inventory_tickets" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "type" "InventoryTxnType" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "note" TEXT,
    "created_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "inventory_tickets_code_key" ON "inventory_tickets"("code");

-- AddForeignKey
ALTER TABLE "inventory_tickets" ADD CONSTRAINT "inventory_tickets_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "staffs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "inventory_tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
