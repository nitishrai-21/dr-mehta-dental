/*
  Warnings:

  - Added the required column `patientStatus` to the `appointments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PatientStatus" AS ENUM ('NEW', 'EXISTING');

-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "patientStatus" "PatientStatus" NOT NULL;
