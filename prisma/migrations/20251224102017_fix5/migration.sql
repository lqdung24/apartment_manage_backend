/*
  Warnings:

  - You are about to drop the column `endDate` on the `Fee` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Fee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Fee" DROP COLUMN "endDate",
DROP COLUMN "type",
ADD COLUMN     "isMandatory" BOOLEAN DEFAULT true;

-- AlterTable
ALTER TABLE "FeeAssignment" ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "HouseHolds" ADD COLUMN     "numCars" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "numMotorbike" INTEGER NOT NULL DEFAULT 0;

-- DropEnum
DROP TYPE "public"."FeeType";
