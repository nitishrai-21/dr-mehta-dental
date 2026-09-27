-- DropIndex
DROP INDEX "patients_email_key";

-- AlterTable
ALTER TABLE "patients" ALTER COLUMN "email" DROP NOT NULL;
