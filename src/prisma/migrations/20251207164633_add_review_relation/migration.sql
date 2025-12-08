/*
  Warnings:

  - A unique constraint covering the columns `[reviewId]` on the table `order_items` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "reviewId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "order_items_reviewId_key" ON "order_items"("reviewId");

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE SET NULL ON UPDATE CASCADE;
