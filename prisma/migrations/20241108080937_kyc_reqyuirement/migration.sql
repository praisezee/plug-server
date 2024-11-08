/*
  Warnings:

  - Added the required column `principal_image` to the `BusinessKyc` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BusinessKyc" ADD COLUMN     "principal_image" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "banner" TEXT,
ADD COLUMN     "dp" TEXT,
ADD COLUMN     "hasPaid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;
