/*
  Warnings:

  - You are about to drop the column `dueDate` on the `FeeAssignment` table. All the data in the column will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `ratePerPerson` on table `Fee` required. This step will fail if there are existing NULL values in that column.
  - Made the column `startDate` on table `Fee` required. This step will fail if there are existing NULL values in that column.
  - Made the column `endDate` on table `Fee` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_feeAssignmentId_fkey";

-- AlterTable
ALTER TABLE "Fee" ALTER COLUMN "ratePerPerson" SET NOT NULL,
ALTER COLUMN "startDate" SET NOT NULL,
ALTER COLUMN "endDate" SET NOT NULL;

-- AlterTable
ALTER TABLE "FeeAssignment" DROP COLUMN "dueDate",
ADD COLUMN     "note" TEXT,
ADD COLUMN     "paidDate" TIMESTAMP(3);

-- DropTable
DROP TABLE "public"."Payment";

-- CreateTable
CREATE TABLE "Notifications" (
    "id" SERIAL NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "isRead" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
