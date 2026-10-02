/*
  Warnings:

  - You are about to drop the column `adminId` on the `OrderLog` table. All the data in the column will be lost.
  - Added the required column `employeeId` to the `OrderLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderLog" DROP CONSTRAINT "OrderLog_adminId_fkey";

-- AlterTable
ALTER TABLE "OrderLog" DROP COLUMN "adminId",
ADD COLUMN     "employeeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "OrderLog" ADD CONSTRAINT "OrderLog_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
