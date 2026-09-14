/*
  Warnings:

  - You are about to drop the column `employeeId` on the `UserPermission` table. All the data in the column will be lost.
  - Added the required column `userId` to the `UserPermission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserPermission" DROP CONSTRAINT "UserPermission_employeeId_fkey";

-- AlterTable
ALTER TABLE "UserPermission" DROP COLUMN "employeeId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
