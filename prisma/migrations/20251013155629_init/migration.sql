/*
  Warnings:

  - A unique constraint covering the columns `[feeAssignmentId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Resident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Resident` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'ACCOUNTANT';

-- AlterTable
ALTER TABLE "Fee" ADD COLUMN     "minium" DOUBLE PRECISION DEFAULT 0,
ALTER COLUMN "ratePerPerson" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Resident" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "idCardIssueDate" TIMESTAMP(3),
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "workingAdress" TEXT,
ALTER COLUMN "dateOfBirth" DROP NOT NULL,
ALTER COLUMN "gender" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_feeAssignmentId_key" ON "Payment"("feeAssignmentId");
