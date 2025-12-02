/*
  Warnings:

  - You are about to drop the column `note` on the `FeeAssignment` table. All the data in the column will be lost.
  - You are about to drop the column `paidDate` on the `FeeAssignment` table. All the data in the column will be lost.
  - You are about to drop the `Notifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResidenceRegistration` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `dueDate` to the `FeeAssignment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InformationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
ALTER TYPE "ResidenceStatus" ADD VALUE 'TEMP_RESIDENT';

-- DropForeignKey
ALTER TABLE "public"."Notifications" DROP CONSTRAINT "Notifications_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Notifications" DROP CONSTRAINT "Notifications_senderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ResidenceRegistration" DROP CONSTRAINT "ResidenceRegistration_householdId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ResidenceRegistration" DROP CONSTRAINT "ResidenceRegistration_residentId_fkey";

-- AlterTable
ALTER TABLE "Fee" ALTER COLUMN "ratePerPerson" DROP NOT NULL,
ALTER COLUMN "startDate" DROP NOT NULL,
ALTER COLUMN "endDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "FeeAssignment" DROP COLUMN "note",
DROP COLUMN "paidDate",
ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Resident" ADD COLUMN     "informationStatus" "InformationStatus" NOT NULL DEFAULT 'PENDING';

-- DropTable
DROP TABLE "public"."Notifications";

-- DropTable
DROP TABLE "public"."ResidenceRegistration";

-- DropEnum
DROP TYPE "public"."RegistrationStatus";

-- DropEnum
DROP TYPE "public"."RegistrationType";

-- CreateTable
CREATE TABLE "TemporaryResidence" (
    "id" SERIAL NOT NULL,
    "residentId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "reason" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "informationStatus" "InformationStatus" NOT NULL DEFAULT 'PENDING',
    "submittedUserId" INTEGER NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAdminId" INTEGER NOT NULL,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "TemporaryResidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemporaryAbsence" (
    "id" SERIAL NOT NULL,
    "residentId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "reason" TEXT,
    "destination" TEXT,
    "informationStatus" "InformationStatus" NOT NULL DEFAULT 'PENDING',
    "submittedUserId" INTEGER NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAdminId" INTEGER NOT NULL,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "TemporaryAbsence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResidentChanges" (
    "id" SERIAL NOT NULL,
    "residentId" INTEGER NOT NULL,

    CONSTRAINT "ResidentChanges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "feeAssignmentId" INTEGER NOT NULL,
    "amountPaid" DOUBLE PRECISION NOT NULL,
    "paidDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_feeAssignmentId_key" ON "Payment"("feeAssignmentId");

-- AddForeignKey
ALTER TABLE "TemporaryResidence" ADD CONSTRAINT "TemporaryResidence_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemporaryResidence" ADD CONSTRAINT "TemporaryResidence_submittedUserId_fkey" FOREIGN KEY ("submittedUserId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemporaryResidence" ADD CONSTRAINT "TemporaryResidence_reviewedAdminId_fkey" FOREIGN KEY ("reviewedAdminId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemporaryAbsence" ADD CONSTRAINT "TemporaryAbsence_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemporaryAbsence" ADD CONSTRAINT "TemporaryAbsence_submittedUserId_fkey" FOREIGN KEY ("submittedUserId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemporaryAbsence" ADD CONSTRAINT "TemporaryAbsence_reviewedAdminId_fkey" FOREIGN KEY ("reviewedAdminId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_feeAssignmentId_fkey" FOREIGN KEY ("feeAssignmentId") REFERENCES "FeeAssignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
