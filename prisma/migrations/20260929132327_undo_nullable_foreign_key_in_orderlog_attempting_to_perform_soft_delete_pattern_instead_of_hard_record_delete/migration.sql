/*
  Warnings:

  - Made the column `orderId` on table `OrderLog` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "OrderLog" DROP CONSTRAINT "OrderLog_orderId_fkey";

-- AlterTable
ALTER TABLE "OrderLog" ALTER COLUMN "orderId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ProductionOrder" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "OrderLog" ADD CONSTRAINT "OrderLog_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "ProductionOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
