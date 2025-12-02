/*
  Warnings:

  - Added the required column `action` to the `ResidentChanges` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submitUserId` to the `ResidentChanges` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Actions" AS ENUM ('CREATE', 'DELETE', 'UPDATE');

-- DropForeignKey
ALTER TABLE "public"."TemporaryAbsence" DROP CONSTRAINT "TemporaryAbsence_reviewedAdminId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TemporaryResidence" DROP CONSTRAINT "TemporaryResidence_reviewedAdminId_fkey";

-- AlterTable
ALTER TABLE "ResidentChanges" ADD COLUMN     "action" "Actions" NOT NULL,
ADD COLUMN     "newData" JSONB,
ADD COLUMN     "oldData" JSONB,
ADD COLUMN     "reviewAdminId" INTEGER,
ADD COLUMN     "reviewAt" TIMESTAMP(3),
ADD COLUMN     "submitAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "submitUserId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TemporaryAbsence" ALTER COLUMN "reviewedAdminId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TemporaryResidence" ALTER COLUMN "reviewedAdminId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "HouseholdChanges" (
    "id" SERIAL NOT NULL,
    "householdId" INTEGER NOT NULL,
    "action" "Actions" NOT NULL,
    "oldData" JSONB,
    "newData" JSONB,
    "submitUserId" INTEGER NOT NULL,
    "submitAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewAdminId" INTEGER,
    "reviewAt" TIMESTAMP(3),

    CONSTRAINT "HouseholdChanges_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TemporaryResidence" ADD CONSTRAINT "TemporaryResidence_reviewedAdminId_fkey" FOREIGN KEY ("reviewedAdminId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemporaryAbsence" ADD CONSTRAINT "TemporaryAbsence_reviewedAdminId_fkey" FOREIGN KEY ("reviewedAdminId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResidentChanges" ADD CONSTRAINT "ResidentChanges_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResidentChanges" ADD CONSTRAINT "ResidentChanges_submitUserId_fkey" FOREIGN KEY ("submitUserId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResidentChanges" ADD CONSTRAINT "ResidentChanges_reviewAdminId_fkey" FOREIGN KEY ("reviewAdminId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HouseholdChanges" ADD CONSTRAINT "HouseholdChanges_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Resident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HouseholdChanges" ADD CONSTRAINT "HouseholdChanges_submitUserId_fkey" FOREIGN KEY ("submitUserId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HouseholdChanges" ADD CONSTRAINT "HouseholdChanges_reviewAdminId_fkey" FOREIGN KEY ("reviewAdminId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
