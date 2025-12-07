/*
  Warnings:

  - A unique constraint covering the columns `[messageId]` on the table `EmailSent` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "EmailSent" ADD COLUMN     "messageId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "EmailSent_messageId_key" ON "EmailSent"("messageId");
