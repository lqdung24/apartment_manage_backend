/*
  Warnings:

  - The values [PERMANENT_RESIDENCE,TEMPORAY_RESIDENCE] on the enum `RelationshipToHead` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RelationshipToHead_new" AS ENUM ('HEAD', 'WIFE', 'HUSBAND', 'SON', 'DAUGHTER', 'FATHER', 'MOTHER', 'OTHER');
ALTER TABLE "Resident" ALTER COLUMN "relationshipToHead" TYPE "RelationshipToHead_new" USING ("relationshipToHead"::text::"RelationshipToHead_new");
ALTER TYPE "RelationshipToHead" RENAME TO "RelationshipToHead_old";
ALTER TYPE "RelationshipToHead_new" RENAME TO "RelationshipToHead";
DROP TYPE "public"."RelationshipToHead_old";
COMMIT;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "imagePath" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "status" "InformationStatus" NOT NULL DEFAULT 'PENDING';
