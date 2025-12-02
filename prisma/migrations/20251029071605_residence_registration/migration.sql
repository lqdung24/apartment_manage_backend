/*
  Warnings:

  - You are about to drop the `TemporaryAbsence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TemporaryResidence` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RegistrationType" AS ENUM ('TEMPORARY', 'PERMANENT', 'TemporaryAbsence');

-- DropForeignKey
ALTER TABLE "public"."TemporaryAbsence" DROP CONSTRAINT "TemporaryAbsence_residentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TemporaryResidence" DROP CONSTRAINT "TemporaryResidence_residentId_fkey";

-- DropTable
DROP TABLE "public"."TemporaryAbsence";

-- DropTable
DROP TABLE "public"."TemporaryResidence";

-- CreateTable
CREATE TABLE "ResidenceRegistration" (
    "id" SERIAL NOT NULL,
    "householdId" INTEGER NOT NULL,
    "residentId" INTEGER NOT NULL,
    "regisType" "RegistrationType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "reason" TEXT,
    "address" TEXT NOT NULL,

    CONSTRAINT "ResidenceRegistration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ResidenceRegistration" ADD CONSTRAINT "ResidenceRegistration_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "HouseHolds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResidenceRegistration" ADD CONSTRAINT "ResidenceRegistration_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
