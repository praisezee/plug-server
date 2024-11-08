/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `Domain` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Domain_url_key" ON "Domain"("url");
