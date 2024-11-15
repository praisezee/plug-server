/*
  Warnings:

  - Added the required column `biz_address` to the `PersonalKyc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `biz_city` to the `PersonalKyc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `biz_state` to the `PersonalKyc` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PersonalKyc" ADD COLUMN     "biz_address" TEXT NOT NULL,
ADD COLUMN     "biz_city" TEXT NOT NULL,
ADD COLUMN     "biz_state" TEXT NOT NULL;
