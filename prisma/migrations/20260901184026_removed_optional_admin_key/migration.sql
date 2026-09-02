/*
  Warnings:

  - Made the column `admin_key` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "admin_key" SET NOT NULL;
