-- AlterTable
ALTER TABLE "HouseholdChanges" ADD COLUMN     "informationStatus" "InformationStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "ResidentChanges" ADD COLUMN     "informationStatus" "InformationStatus" NOT NULL DEFAULT 'PENDING';
