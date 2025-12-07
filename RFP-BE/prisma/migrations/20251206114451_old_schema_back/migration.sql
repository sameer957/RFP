-- AlterTable
ALTER TABLE "EmailReply" ADD COLUMN     "bodyHtml" TEXT,
ADD COLUMN     "raw" TEXT,
ADD COLUMN     "score" DOUBLE PRECISION;
