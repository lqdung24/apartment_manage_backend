/*
  Warnings:

  - You are about to drop the column `isPending` on the `HouseholdChanges` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."HouseholdChanges_householdId_isPending_key";

-- AlterTable
ALTER TABLE "HouseholdChanges" DROP COLUMN "isPending";
