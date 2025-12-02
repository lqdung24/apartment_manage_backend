/*
  Warnings:

  - You are about to drop the column `residencStatus` on the `Resident` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Resident" DROP COLUMN "residencStatus",
ADD COLUMN     "residetStatus" "ResidenceStatus" NOT NULL DEFAULT 'NORMAL';
