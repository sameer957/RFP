/*
  Warnings:

  - You are about to drop the column `messageId` on the `EmailSent` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "EmailSent_messageId_key";

-- AlterTable
ALTER TABLE "EmailSent" DROP COLUMN "messageId";
