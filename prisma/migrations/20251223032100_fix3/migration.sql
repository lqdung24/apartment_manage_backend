-- AlterTable
ALTER TABLE "HouseholdChanges" ALTER COLUMN "updateReason" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ResidentChanges" ALTER COLUMN "updateReason" DROP NOT NULL;
