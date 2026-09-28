/*
  Warnings:

  - Added the required column `employeeAssigned` to the `ProductionOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductionOrder" ADD COLUMN     "employeeAssigned" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ProductionOrder" ADD CONSTRAINT "ProductionOrder_employeeAssigned_fkey" FOREIGN KEY ("employeeAssigned") REFERENCES "User"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;
