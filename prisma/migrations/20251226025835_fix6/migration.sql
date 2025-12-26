/*
  Warnings:

  - You are about to drop the column `frequency` on the `Fee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Fee" DROP COLUMN "frequency",
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "Repeatfee" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isMandatory" BOOLEAN DEFAULT true,
    "frequency" "Frequency" NOT NULL,
    "rate" DOUBLE PRECISION DEFAULT 0,
    "calculationBase" "FeeCalculationBase" NOT NULL DEFAULT 'PER_HOUSEHOLD',
    "anchorDay" INTEGER,
    "anchorMonth" INTEGER,
    "status" "FeeStatus" NOT NULL DEFAULT 'PAUSED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Repeatfee_pkey" PRIMARY KEY ("id")
);
