-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('REGISTERED', 'NOTREGISTERED');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "IdType" AS ENUM ('PASSPORT', 'NIN', 'VOTER_CARD', 'DRIVER_LICENCE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" "RegistrationStatus" NOT NULL,
    "password" TEXT NOT NULL,
    "terms" BOOLEAN NOT NULL,
    "otp" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Domain" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "url" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PersonalKyc" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "dob" TEXT NOT NULL,
    "bvn" INTEGER NOT NULL,
    "phone_number" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "id_type" "IdType" NOT NULL,
    "id_number" TEXT NOT NULL,
    "id_exp" TEXT NOT NULL,
    "proof_id" TEXT NOT NULL,
    "proof_address" TEXT NOT NULL,
    "other_docs" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "BusinessKyc" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "reg_type" TEXT NOT NULL,
    "reg_date" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "reg_address" TEXT NOT NULL,
    "biz_address" TEXT NOT NULL,
    "biz_city" TEXT NOT NULL,
    "biz_state" TEXT NOT NULL,
    "reg_city" TEXT NOT NULL,
    "reg_state" TEXT NOT NULL,
    "reg_number" TEXT NOT NULL,
    "tax_number" TEXT NOT NULL,
    "biz_cert" TEXT NOT NULL,
    "mermat_doc" TEXT NOT NULL,
    "status_report" TEXT NOT NULL,
    "principal_id" TEXT NOT NULL,
    "id_type" "IdType" NOT NULL,
    "proof_address" TEXT NOT NULL,
    "other_docs" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Directors" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "dob" TEXT NOT NULL,
    "bvn" INTEGER NOT NULL,
    "phone_number" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "owner_share" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Domain_id_key" ON "Domain"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Domain_userId_key" ON "Domain"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalKyc_id_key" ON "PersonalKyc"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalKyc_userId_key" ON "PersonalKyc"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessKyc_id_key" ON "BusinessKyc"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessKyc_userId_key" ON "BusinessKyc"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Directors_id_key" ON "Directors"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Directors_businessId_key" ON "Directors"("businessId");

-- AddForeignKey
ALTER TABLE "Domain" ADD CONSTRAINT "Domain_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalKyc" ADD CONSTRAINT "PersonalKyc_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessKyc" ADD CONSTRAINT "BusinessKyc_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Directors" ADD CONSTRAINT "Directors_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "BusinessKyc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
