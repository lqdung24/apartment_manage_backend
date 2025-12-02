/*
  Warnings:

  - Added the required column `status` to the `ResidenceRegistration` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- AlterTable
ALTER TABLE "ResidenceRegistration" ADD COLUMN     "status" "RegistrationStatus" NOT NULL;
