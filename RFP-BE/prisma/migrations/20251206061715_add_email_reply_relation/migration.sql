-- CreateTable
CREATE TABLE "EmailReply" (
    "id" SERIAL NOT NULL,
    "promptId" INTEGER NOT NULL,
    "vendorEmail" TEXT NOT NULL,
    "messageId" TEXT,
    "raw" TEXT,
    "bodyText" TEXT,
    "bodyHtml" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "score" DOUBLE PRECISION,
    "selected" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EmailReply_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EmailReply_promptId_idx" ON "EmailReply"("promptId");

-- AddForeignKey
ALTER TABLE "EmailReply" ADD CONSTRAINT "EmailReply_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "RFPRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
