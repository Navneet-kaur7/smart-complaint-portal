/*
  Warnings:

  - You are about to drop the column `complaint_id` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `consumer_id` on the `complaints` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `complaints` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `complaints` table. All the data in the column will be lost.
  - Added the required column `complaintId` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `consumerId` to the `complaints` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `complaints` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_complaint_id_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "complaints" DROP CONSTRAINT "complaints_consumer_id_fkey";

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "complaint_id",
DROP COLUMN "created_at",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
ADD COLUMN     "complaintId" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "complaints" DROP COLUMN "consumer_id",
DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "consumerId" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_complaintId_fkey" FOREIGN KEY ("complaintId") REFERENCES "complaints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
