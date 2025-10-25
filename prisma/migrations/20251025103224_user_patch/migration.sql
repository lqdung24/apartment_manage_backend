/*
  Warnings:

  - A unique constraint covering the columns `[householdId]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "householdId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Users_householdId_key" ON "Users"("householdId");
