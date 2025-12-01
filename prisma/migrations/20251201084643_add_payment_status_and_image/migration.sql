-- CreateEnum
CREATE TYPE "InformationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'DELETED');

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "imagePath" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "status" "InformationStatus" NOT NULL DEFAULT 'PENDING';
