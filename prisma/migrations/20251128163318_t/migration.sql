/*
  Warnings:

  - You are about to drop the `TemporaryResidence` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."TemporaryResidence" DROP CONSTRAINT "TemporaryResidence_householdId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TemporaryResidence" DROP CONSTRAINT "TemporaryResidence_residentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TemporaryResidence" DROP CONSTRAINT "TemporaryResidence_reviewedAdminId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TemporaryResidence" DROP CONSTRAINT "TemporaryResidence_submittedUserId_fkey";

-- DropTable
DROP TABLE "public"."TemporaryResidence";

-- CreateTable
CREATE TABLE "TemporaryResident" (
    "id" SERIAL NOT NULL,
    "residentId" INTEGER NOT NULL,
    "householdId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "informationStatus" "InformationStatus" NOT NULL DEFAULT 'PENDING',
    "submittedUserId" INTEGER NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAdminId" INTEGER,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "TemporaryResident_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TemporaryResident" ADD CONSTRAINT "TemporaryResident_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "HouseHolds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemporaryResident" ADD CONSTRAINT "TemporaryResident_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemporaryResident" ADD CONSTRAINT "TemporaryResident_submittedUserId_fkey" FOREIGN KEY ("submittedUserId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemporaryResident" ADD CONSTRAINT "TemporaryResident_reviewedAdminId_fkey" FOREIGN KEY ("reviewedAdminId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
