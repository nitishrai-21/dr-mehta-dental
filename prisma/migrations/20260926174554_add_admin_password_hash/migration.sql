/*
  Warnings:

  - A unique constraint covering the columns `[shareToken]` on the table `prescriptions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'ADMIN';

-- AlterTable
ALTER TABLE "prescriptions" ADD COLUMN     "shareToken" TEXT,
ADD COLUMN     "shareTokenCreatedAt" TIMESTAMP(3),
ADD COLUMN     "shareTokenExpiresAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "prescriptions_shareToken_key" ON "prescriptions"("shareToken");

-- CreateIndex
CREATE INDEX "prescriptions_shareToken_idx" ON "prescriptions"("shareToken");
