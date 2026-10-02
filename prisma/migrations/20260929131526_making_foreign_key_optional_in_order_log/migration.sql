-- DropForeignKey
ALTER TABLE "OrderLog" DROP CONSTRAINT "OrderLog_orderId_fkey";

-- AlterTable
ALTER TABLE "OrderLog" ALTER COLUMN "orderId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "OrderLog" ADD CONSTRAINT "OrderLog_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "ProductionOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
