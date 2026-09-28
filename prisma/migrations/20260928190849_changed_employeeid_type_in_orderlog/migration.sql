-- DropForeignKey
ALTER TABLE "OrderLog" DROP CONSTRAINT "OrderLog_employeeId_fkey";

-- AlterTable
ALTER TABLE "OrderLog" ALTER COLUMN "employeeId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "OrderLog" ADD CONSTRAINT "OrderLog_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;
