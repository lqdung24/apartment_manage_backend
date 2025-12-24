/*
  Warnings:

  - Added the required column `updateReason` to the `HouseholdChanges` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateReason` to the `ResidentChanges` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HouseholdChanges" ADD COLUMN     "rejectReason" TEXT,
ADD COLUMN     "updateReason" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ResidentChanges" ADD COLUMN     "updateReason" TEXT NOT NULL;
