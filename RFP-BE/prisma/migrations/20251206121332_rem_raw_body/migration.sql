/*
  Warnings:

  - You are about to drop the column `bodyHtml` on the `EmailReply` table. All the data in the column will be lost.
  - You are about to drop the column `raw` on the `EmailReply` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EmailReply" DROP COLUMN "bodyHtml",
DROP COLUMN "raw";
