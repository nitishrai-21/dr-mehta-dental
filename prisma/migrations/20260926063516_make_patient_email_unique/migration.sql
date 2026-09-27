/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `patients` will be added. If there are existing duplicate values, this will fail.
  - Made the column `email` on table `patients` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "patients" ALTER COLUMN "email" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "patients_email_key" ON "patients"("email");
