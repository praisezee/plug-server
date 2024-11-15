/*
  Warnings:

  - Added the required column `updated_at` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('FLAT', 'PERCENTAGE');

-- CreateEnum
CREATE TYPE "VariationType" AS ENUM ('COLOR', 'SIZE', 'OTHERS');

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "image" TEXT[],
    "hasDiscount" BOOLEAN NOT NULL DEFAULT false,
    "discount" DOUBLE PRECISION,
    "discountType" "DiscountType",
    "hasVariation" BOOLEAN NOT NULL DEFAULT false,
    "unit" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Variation" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "type" "VariationType" NOT NULL,
    "variant" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Item_id_key" ON "Item"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Variation_id_key" ON "Variation"("id");

-- AddForeignKey
ALTER TABLE "Variation" ADD CONSTRAINT "Variation_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
