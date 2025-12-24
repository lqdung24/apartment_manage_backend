/*
  Warnings:

  - You are about to drop the column `newData` on the `HouseholdChanges` table. All the data in the column will be lost.
  - You are about to drop the column `oldData` on the `HouseholdChanges` table. All the data in the column will be lost.
  - You are about to drop the column `newData` on the `ResidentChanges` table. All the data in the column will be lost.
  - You are about to drop the column `oldData` on the `ResidentChanges` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HouseholdChanges" DROP COLUMN "newData",
DROP COLUMN "oldData";

-- AlterTable
ALTER TABLE "ResidentChanges" DROP COLUMN "newData",
DROP COLUMN "oldData";
