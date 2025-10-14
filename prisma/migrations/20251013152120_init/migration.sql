/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "HouseHoldStatus" AS ENUM ('ACTIVE', 'MOVED', 'DELETE');

-- CreateEnum
CREATE TYPE "ResidenceStatus" AS ENUM ('NORMAL', 'TEMP_ABSENT', 'MOVE_OUT');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "RelationshipToHead" AS ENUM ('HEAD', 'WIFE', 'HUSBAND', 'SON', 'DAUGHTER', 'FATHER', 'MOTHER', 'OTHER');

-- CreateEnum
CREATE TYPE "FeeType" AS ENUM ('MANDATORY', 'VOLUNTARY');

-- CreateEnum
CREATE TYPE "FeeFrequency" AS ENUM ('ONE_TIME', 'MONTHLY', 'YEARLY');

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createtime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HouseHolds" (
    "id" SERIAL NOT NULL,
    "houseHoldCode" INTEGER NOT NULL,
    "apartmentNumber" TEXT NOT NULL,
    "buildingNumber" TEXT,
    "street" TEXT,
    "ward" TEXT,
    "province" TEXT,
    "status" "HouseHoldStatus" NOT NULL,
    "createtime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "headID" INTEGER NOT NULL,
    "userID" INTEGER NOT NULL,

    CONSTRAINT "HouseHolds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resident" (
    "id" SERIAL NOT NULL,
    "nationalId" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "relationshipToHead" "RelationshipToHead" NOT NULL,
    "placeOfOrigin" TEXT,
    "occupation" TEXT,
    "houseHoldId" INTEGER,
    "residencStatus" "ResidenceStatus" NOT NULL DEFAULT 'NORMAL',

    CONSTRAINT "Resident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemporaryResidence" (
    "id" SERIAL NOT NULL,
    "residentId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "reason" TEXT,
    "address" TEXT NOT NULL,

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

    CONSTRAINT "TemporaryAbsence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fee" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "FeeType" NOT NULL,
    "frequency" "FeeFrequency" NOT NULL,
    "ratePerPerson" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Fee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeeAssignment" (
    "id" SERIAL NOT NULL,
    "feeId" INTEGER NOT NULL,
    "householdId" INTEGER NOT NULL,
    "amountDue" DOUBLE PRECISION NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FeeAssignment_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "HouseHolds_houseHoldCode_key" ON "HouseHolds"("houseHoldCode");

-- CreateIndex
CREATE UNIQUE INDEX "HouseHolds_apartmentNumber_key" ON "HouseHolds"("apartmentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "HouseHolds_headID_key" ON "HouseHolds"("headID");

-- CreateIndex
CREATE UNIQUE INDEX "HouseHolds_userID_key" ON "HouseHolds"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "Resident_nationalId_key" ON "Resident"("nationalId");

-- AddForeignKey
ALTER TABLE "HouseHolds" ADD CONSTRAINT "HouseHolds_headID_fkey" FOREIGN KEY ("headID") REFERENCES "Resident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HouseHolds" ADD CONSTRAINT "HouseHolds_userID_fkey" FOREIGN KEY ("userID") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resident" ADD CONSTRAINT "Resident_houseHoldId_fkey" FOREIGN KEY ("houseHoldId") REFERENCES "HouseHolds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemporaryResidence" ADD CONSTRAINT "TemporaryResidence_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemporaryAbsence" ADD CONSTRAINT "TemporaryAbsence_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeAssignment" ADD CONSTRAINT "FeeAssignment_feeId_fkey" FOREIGN KEY ("feeId") REFERENCES "Fee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeAssignment" ADD CONSTRAINT "FeeAssignment_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "HouseHolds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_feeAssignmentId_fkey" FOREIGN KEY ("feeAssignmentId") REFERENCES "FeeAssignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
