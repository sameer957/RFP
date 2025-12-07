/*
  Warnings:

  - You are about to drop the `Templates` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `vendorId` to the `EmailReply` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vendorId` to the `EmailSent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmailReply" ADD COLUMN     "summary" TEXT,
ADD COLUMN     "vendorId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "EmailSent" ADD COLUMN     "vendorId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RFPRequest" ADD COLUMN     "title" TEXT;

-- AlterTable
ALTER TABLE "Vendor" ALTER COLUMN "category" DROP NOT NULL;

-- DropTable
DROP TABLE "Templates";

-- CreateTable
CREATE TABLE "VendorProposal" (
    "id" SERIAL NOT NULL,
    "promptId" INTEGER NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "replyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "totalAmount" DOUBLE PRECISION,
    "currency" TEXT,
    "deliveryDays" INTEGER,
    "warrantyMonths" INTEGER,
    "completenessScore" DOUBLE PRECISION,
    "clarityScore" DOUBLE PRECISION,
    "riskScore" DOUBLE PRECISION,
    "overallScore" DOUBLE PRECISION,
    "details" JSONB,

    CONSTRAINT "VendorProposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BestRFP" (
    "id" SERIAL NOT NULL,
    "promptId" INTEGER NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "replyId" INTEGER NOT NULL,
    "proposalId" INTEGER NOT NULL,
    "overallScore" DOUBLE PRECISION NOT NULL,
    "reason" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BestRFP_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VendorProposal_promptId_vendorId_key" ON "VendorProposal"("promptId", "vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "BestRFP_promptId_key" ON "BestRFP"("promptId");

-- AddForeignKey
ALTER TABLE "EmailSent" ADD CONSTRAINT "EmailSent_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailReply" ADD CONSTRAINT "EmailReply_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorProposal" ADD CONSTRAINT "VendorProposal_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "RFPRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorProposal" ADD CONSTRAINT "VendorProposal_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorProposal" ADD CONSTRAINT "VendorProposal_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "EmailReply"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BestRFP" ADD CONSTRAINT "BestRFP_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "RFPRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BestRFP" ADD CONSTRAINT "BestRFP_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BestRFP" ADD CONSTRAINT "BestRFP_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "EmailReply"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BestRFP" ADD CONSTRAINT "BestRFP_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "VendorProposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
