/*
  Warnings:

  - Added the required column `householdId` to the `TemporaryResidence` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TemporaryResidence" ADD COLUMN     "householdId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "TemporaryResidence" ADD CONSTRAINT "TemporaryResidence_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "HouseHolds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
