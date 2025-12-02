/*
  Warnings:

  - Made the column `endDate` on table `TemporaryAbsence` required. This step will fail if there are existing NULL values in that column.
  - Made the column `reason` on table `TemporaryAbsence` required. This step will fail if there are existing NULL values in that column.
  - Made the column `destination` on table `TemporaryAbsence` required. This step will fail if there are existing NULL values in that column.
  - Made the column `endDate` on table `TemporaryResidence` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "TemporaryAbsence" ALTER COLUMN "endDate" SET NOT NULL,
ALTER COLUMN "reason" SET NOT NULL,
ALTER COLUMN "destination" SET NOT NULL;

-- AlterTable
ALTER TABLE "TemporaryResidence" ALTER COLUMN "endDate" SET NOT NULL;
