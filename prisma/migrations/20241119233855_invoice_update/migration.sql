/*
  Warnings:

  - Added the required column `description` to the `InvoiceItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `InvoiceItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `InvoiceItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InvoiceItem" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
