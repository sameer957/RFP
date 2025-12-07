/*
  Warnings:

  - You are about to drop the column `bodyHtml` on the `EmailReply` table. All the data in the column will be lost.
  - You are about to drop the column `raw` on the `EmailReply` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `EmailReply` table. All the data in the column will be lost.
  - You are about to drop the column `selected` on the `EmailReply` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `EmailReply` table. All the data in the column will be lost.
  - You are about to drop the column `vendorId` on the `EmailReply` table. All the data in the column will be lost.
  - You are about to drop the column `vendorId` on the `EmailSent` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `RFPRequest` table. All the data in the column will be lost.
  - You are about to drop the `BestRFP` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VendorProposal` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `category` on table `Vendor` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "BestRFP" DROP CONSTRAINT "BestRFP_promptId_fkey";

-- DropForeignKey
ALTER TABLE "BestRFP" DROP CONSTRAINT "BestRFP_proposalId_fkey";

-- DropForeignKey
ALTER TABLE "BestRFP" DROP CONSTRAINT "BestRFP_replyId_fkey";

-- DropForeignKey
ALTER TABLE "BestRFP" DROP CONSTRAINT "BestRFP_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "EmailReply" DROP CONSTRAINT "EmailReply_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "EmailSent" DROP CONSTRAINT "EmailSent_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "VendorProposal" DROP CONSTRAINT "VendorProposal_promptId_fkey";

-- DropForeignKey
ALTER TABLE "VendorProposal" DROP CONSTRAINT "VendorProposal_replyId_fkey";

-- DropForeignKey
ALTER TABLE "VendorProposal" DROP CONSTRAINT "VendorProposal_vendorId_fkey";

-- AlterTable
ALTER TABLE "EmailReply" DROP COLUMN "bodyHtml",
DROP COLUMN "raw",
DROP COLUMN "score",
DROP COLUMN "selected",
DROP COLUMN "summary",
DROP COLUMN "vendorId";

-- AlterTable
ALTER TABLE "EmailSent" DROP COLUMN "vendorId";

-- AlterTable
ALTER TABLE "RFPRequest" DROP COLUMN "title";

-- AlterTable
ALTER TABLE "Vendor" ALTER COLUMN "category" SET NOT NULL;

-- DropTable
DROP TABLE "BestRFP";

-- DropTable
DROP TABLE "VendorProposal";
