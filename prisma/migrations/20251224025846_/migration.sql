/*
  Warnings:

  - A unique constraint covering the columns `[householdId,isPending]` on the table `HouseholdChanges` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "HouseholdChanges" ADD COLUMN     "isPending" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "HouseholdChanges_householdId_isPending_key" ON "HouseholdChanges"("householdId", "isPending");
