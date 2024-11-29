/*
  Warnings:

  - Added the required column `principal_image` to the `PersonalKyc` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PersonalKyc" ADD COLUMN     "principal_image" TEXT NOT NULL;
