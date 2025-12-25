/*
  Warnings:

  - You are about to drop the column `minium` on the `Fee` table. All the data in the column will be lost.
  - You are about to drop the column `ratePerPerson` on the `Fee` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Fee` table. All the data in the column will be lost.
  - Added the required column `calculationBase` to the `Fee` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `frequency` on the `Fee` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "FeeStatus" AS ENUM ('ACTIVE', 'PAUSED', 'STOPPED');

-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('ONE_TIME', 'MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "FeeCalculationBase" AS ENUM ('PER_PERSON', 'PER_HOUSEHOLD', 'PER_MOTORBIKE', 'PER_CAR');

-- AlterTable
ALTER TABLE "Fee" DROP COLUMN "minium",
DROP COLUMN "ratePerPerson",
DROP COLUMN "startDate",
ADD COLUMN     "anchorDay" INTEGER,
ADD COLUMN     "anchorMonth" INTEGER,
ADD COLUMN     "calculationBase" "FeeCalculationBase" NOT NULL,
ADD COLUMN     "rate" DOUBLE PRECISION,
ADD COLUMN     "status" "FeeStatus" NOT NULL DEFAULT 'PAUSED',
DROP COLUMN "frequency",
ADD COLUMN     "frequency" "Frequency" NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "amountPaid" DROP NOT NULL;

-- DropEnum
DROP TYPE "public"."FeeFrequency";
