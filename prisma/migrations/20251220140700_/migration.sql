/*
  Warnings:

  - The values [DELETED] on the enum `InformationStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `address` on the `TemporaryResident` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InformationStatus_new" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'ENDED');
ALTER TABLE "public"."Payment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Resident" ALTER COLUMN "informationStatus" DROP DEFAULT;
ALTER TABLE "public"."TemporaryAbsence" ALTER COLUMN "informationStatus" DROP DEFAULT;
ALTER TABLE "public"."TemporaryResident" ALTER COLUMN "informationStatus" DROP DEFAULT;
ALTER TABLE "Resident" ALTER COLUMN "informationStatus" TYPE "InformationStatus_new" USING ("informationStatus"::text::"InformationStatus_new");
ALTER TABLE "Payment" ALTER COLUMN "status" TYPE "InformationStatus_new" USING ("status"::text::"InformationStatus_new");
ALTER TABLE "TemporaryResident" ALTER COLUMN "informationStatus" TYPE "InformationStatus_new" USING ("informationStatus"::text::"InformationStatus_new");
ALTER TABLE "TemporaryAbsence" ALTER COLUMN "informationStatus" TYPE "InformationStatus_new" USING ("informationStatus"::text::"InformationStatus_new");
ALTER TYPE "InformationStatus" RENAME TO "InformationStatus_old";
ALTER TYPE "InformationStatus_new" RENAME TO "InformationStatus";
DROP TYPE "public"."InformationStatus_old";
ALTER TABLE "Payment" ALTER COLUMN "status" SET DEFAULT 'PENDING';
ALTER TABLE "Resident" ALTER COLUMN "informationStatus" SET DEFAULT 'PENDING';
ALTER TABLE "TemporaryAbsence" ALTER COLUMN "informationStatus" SET DEFAULT 'PENDING';
ALTER TABLE "TemporaryResident" ALTER COLUMN "informationStatus" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "ResidentChanges" ADD COLUMN     "rejectReason" TEXT;

-- AlterTable
ALTER TABLE "TemporaryAbsence" ADD COLUMN     "rejectReason" TEXT;

-- AlterTable
ALTER TABLE "TemporaryResident" DROP COLUMN "address",
ADD COLUMN     "rejectReason" TEXT;
