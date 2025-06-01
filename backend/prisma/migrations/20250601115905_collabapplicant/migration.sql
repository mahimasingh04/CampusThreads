/*
  Warnings:

  - You are about to drop the column `authorId` on the `CollaborationPost` table. All the data in the column will be lost.
  - You are about to drop the column `collabRole` on the `CollaborationPost` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `CollaborationPost` table. All the data in the column will be lost.
  - You are about to drop the column `genderReq` on the `CollaborationPost` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `CollaborationPost` table. All the data in the column will be lost.
  - You are about to drop the column `slotsFilled` on the `CollaborationPost` table. All the data in the column will be lost.
  - You are about to drop the column `slotsTotal` on the `CollaborationPost` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `CollaborationPost` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `CollaborationPost` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[postId]` on the table `CollaborationPost` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `eventDate` to the `CollaborationPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventName` to the `CollaborationPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postId` to the `CollaborationPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalSpots` to the `CollaborationPost` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CollaborationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "CollaborationPost" DROP CONSTRAINT "CollaborationPost_authorId_fkey";

-- AlterTable
ALTER TABLE "CollaborationPost" DROP COLUMN "authorId",
DROP COLUMN "collabRole",
DROP COLUMN "createdAt",
DROP COLUMN "genderReq",
DROP COLUMN "isActive",
DROP COLUMN "slotsFilled",
DROP COLUMN "slotsTotal",
DROP COLUMN "title",
DROP COLUMN "updatedAt",
ADD COLUMN     "eventDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "eventLink" TEXT,
ADD COLUMN     "eventName" TEXT NOT NULL,
ADD COLUMN     "filledSpots" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "postId" TEXT NOT NULL,
ADD COLUMN     "rolesNeeded" "Role"[],
ADD COLUMN     "totalSpots" INTEGER NOT NULL,
ALTER COLUMN "location" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "isCollaboration" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "CollaborationApplicant" (
    "id" TEXT NOT NULL,
    "collaborationPostId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "CollaborationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollaborationApplicant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserPosts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserPosts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "CollaborationApplicant_collaborationPostId_userId_key" ON "CollaborationApplicant"("collaborationPostId", "userId");

-- CreateIndex
CREATE INDEX "_UserPosts_B_index" ON "_UserPosts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "CollaborationPost_postId_key" ON "CollaborationPost"("postId");

-- AddForeignKey
ALTER TABLE "CollaborationPost" ADD CONSTRAINT "CollaborationPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollaborationApplicant" ADD CONSTRAINT "CollaborationApplicant_collaborationPostId_fkey" FOREIGN KEY ("collaborationPostId") REFERENCES "CollaborationPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollaborationApplicant" ADD CONSTRAINT "CollaborationApplicant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserPosts" ADD CONSTRAINT "_UserPosts_A_fkey" FOREIGN KEY ("A") REFERENCES "CollaborationPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserPosts" ADD CONSTRAINT "_UserPosts_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
