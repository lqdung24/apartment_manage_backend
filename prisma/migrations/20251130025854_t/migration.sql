/*
  Warnings:

  - You are about to drop the column `residetStatus` on the `Resident` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Resident" DROP COLUMN "residetStatus",
ADD COLUMN     "residentStatus" "ResidenceStatus" NOT NULL DEFAULT 'NORMAL';
