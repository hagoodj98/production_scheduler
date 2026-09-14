/*
  Warnings:

  - You are about to drop the column `userId` on the `UserPermission` table. All the data in the column will be lost.
  - Added the required column `employeeId` to the `UserPermission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserPermission" DROP CONSTRAINT "UserPermission_userId_fkey";

-- AlterTable
ALTER TABLE "UserPermission" DROP COLUMN "userId",
ADD COLUMN     "employeeId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;
