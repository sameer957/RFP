-- CreateTable
CREATE TABLE "RFPRequest" (
    "id" SERIAL NOT NULL,
    "prompt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RFPRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RfpResponse" (
    "id" SERIAL NOT NULL,
    "promptId" INTEGER NOT NULL,
    "rfpJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RfpResponse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RfpResponse" ADD CONSTRAINT "RfpResponse_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "RFPRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
