/*
  Warnings:

  - You are about to drop the column `bvn` on the `Directors` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `Directors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Directors" DROP COLUMN "bvn",
DROP COLUMN "phone_number";
