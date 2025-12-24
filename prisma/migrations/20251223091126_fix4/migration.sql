-- DropForeignKey
ALTER TABLE "public"."HouseholdChanges" DROP CONSTRAINT "HouseholdChanges_householdId_fkey";

-- AddForeignKey
ALTER TABLE "HouseholdChanges" ADD CONSTRAINT "HouseholdChanges_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "HouseHolds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
