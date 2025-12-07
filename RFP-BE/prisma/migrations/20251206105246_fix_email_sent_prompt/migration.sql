-- DropForeignKey
ALTER TABLE "EmailSent" DROP CONSTRAINT "EmailSent_vendorId_fkey";

-- AlterTable
ALTER TABLE "EmailSent" ALTER COLUMN "vendorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "EmailSent" ADD CONSTRAINT "EmailSent_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
