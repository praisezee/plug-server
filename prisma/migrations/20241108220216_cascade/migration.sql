-- DropForeignKey
ALTER TABLE "BusinessKyc" DROP CONSTRAINT "BusinessKyc_userId_fkey";

-- DropForeignKey
ALTER TABLE "Directors" DROP CONSTRAINT "Directors_businessId_fkey";

-- DropForeignKey
ALTER TABLE "Domain" DROP CONSTRAINT "Domain_userId_fkey";

-- DropForeignKey
ALTER TABLE "PersonalKyc" DROP CONSTRAINT "PersonalKyc_userId_fkey";

-- AddForeignKey
ALTER TABLE "Domain" ADD CONSTRAINT "Domain_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalKyc" ADD CONSTRAINT "PersonalKyc_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessKyc" ADD CONSTRAINT "BusinessKyc_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Directors" ADD CONSTRAINT "Directors_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "BusinessKyc"("id") ON DELETE CASCADE ON UPDATE CASCADE;
