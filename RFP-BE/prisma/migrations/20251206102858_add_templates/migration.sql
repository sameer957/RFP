-- CreateTable
CREATE TABLE "Templates" (
    "id" SERIAL NOT NULL,
    "templateId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Templates_pkey" PRIMARY KEY ("id")
);
