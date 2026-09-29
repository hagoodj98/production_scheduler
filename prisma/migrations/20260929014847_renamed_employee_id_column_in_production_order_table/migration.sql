/*
  Warnings:

  - You are about to drop the column `employeeAssigned` on the `ProductionOrder` table. All the data in the column will be lost.
  - Added the required column `employeeAssigneeID` to the `ProductionOrder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductionOrder" DROP CONSTRAINT "ProductionOrder_employeeAssigned_fkey";

-- AlterTable
ALTER TABLE "ProductionOrder" DROP COLUMN "employeeAssigned",
ADD COLUMN     "employeeAssigneeID" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ProductionOrder" ADD CONSTRAINT "ProductionOrder_employeeAssigneeID_fkey" FOREIGN KEY ("employeeAssigneeID") REFERENCES "User"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;
