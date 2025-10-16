/*
  Warnings:

  - You are about to drop the column `idCardIssueDate` on the `Resident` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phoneNumber]` on the table `Resident` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Resident` will be added. If there are existing duplicate values, this will fail.
  - Made the column `buildingNumber` on table `HouseHolds` required. This step will fail if there are existing NULL values in that column.
  - Made the column `street` on table `HouseHolds` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ward` on table `HouseHolds` required. This step will fail if there are existing NULL values in that column.
  - Made the column `province` on table `HouseHolds` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dateOfBirth` on table `Resident` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `Resident` required. This step will fail if there are existing NULL values in that column.
  - Made the column `placeOfOrigin` on table `Resident` required. This step will fail if there are existing NULL values in that column.
  - Made the column `occupation` on table `Resident` required. This step will fail if there are existing NULL values in that column.
  - Made the column `workingAdress` on table `Resident` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "HouseHolds" ALTER COLUMN "buildingNumber" SET NOT NULL,
ALTER COLUMN "street" SET NOT NULL,
ALTER COLUMN "ward" SET NOT NULL,
ALTER COLUMN "province" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Resident" DROP COLUMN "idCardIssueDate",
ALTER COLUMN "dateOfBirth" SET NOT NULL,
ALTER COLUMN "gender" SET NOT NULL,
ALTER COLUMN "placeOfOrigin" SET NOT NULL,
ALTER COLUMN "occupation" SET NOT NULL,
ALTER COLUMN "workingAdress" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Resident_phoneNumber_key" ON "Resident"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Resident_email_key" ON "Resident"("email");
