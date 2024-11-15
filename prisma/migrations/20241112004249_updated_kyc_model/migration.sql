/*
  Warnings:

  - Added the required column `proof_id` to the `BusinessKyc` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BusinessKyc" ADD COLUMN     "proof_id" TEXT NOT NULL;
