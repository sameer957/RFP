-- CreateTable
CREATE TABLE "EmailSent" (
    "id" SERIAL NOT NULL,
    "promptId" INTEGER NOT NULL,
    "vendorEmail" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailSent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailSent_promptId_vendorEmail_key" ON "EmailSent"("promptId", "vendorEmail");

-- AddForeignKey
ALTER TABLE "EmailSent" ADD CONSTRAINT "EmailSent_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "RFPRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
