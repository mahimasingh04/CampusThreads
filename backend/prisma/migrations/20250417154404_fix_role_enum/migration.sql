/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[hackathonpostId,userId]` on the table `Request` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `HackathonPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'UNKNOWN';

-- DropForeignKey
ALTER TABLE "CustomFeed" DROP CONSTRAINT "CustomFeed_userId_fkey";

-- DropForeignKey
ALTER TABLE "CustomFeedCommunity" DROP CONSTRAINT "CustomFeedCommunity_communityId_fkey";

-- DropForeignKey
ALTER TABLE "CustomFeedCommunity" DROP CONSTRAINT "CustomFeedCommunity_customFeedId_fkey";

-- DropForeignKey
ALTER TABLE "Flair" DROP CONSTRAINT "Flair_communityId_fkey";

-- DropForeignKey
ALTER TABLE "HackathonPost" DROP CONSTRAINT "HackathonPost_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_communityId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_flairId_fkey";

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_hackathonpostId_fkey";

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_userId_fkey";

-- DropForeignKey
ALTER TABLE "SavedPost" DROP CONSTRAINT "SavedPost_postId_fkey";

-- DropForeignKey
ALTER TABLE "SavedPost" DROP CONSTRAINT "SavedPost_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserCommunity" DROP CONSTRAINT "UserCommunity_communityId_fkey";

-- DropForeignKey
ALTER TABLE "UserCommunity" DROP CONSTRAINT "UserCommunity_userId_fkey";

-- AlterTable
ALTER TABLE "HackathonPost" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "Like" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "likeSource" TEXT NOT NULL DEFAULT 'FEED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityVisit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    "visitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityVisit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Like_postId_userId_key" ON "Like"("postId", "userId");

-- CreateIndex
CREATE INDEX "CommunityVisit_userId_visitedAt_idx" ON "CommunityVisit"("userId", "visitedAt");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityVisit_userId_communityId_key" ON "CommunityVisit"("userId", "communityId");

-- CreateIndex
CREATE UNIQUE INDEX "Request_hackathonpostId_userId_key" ON "Request"("hackathonpostId", "userId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_flairId_fkey" FOREIGN KEY ("flairId") REFERENCES "Flair"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flair" ADD CONSTRAINT "Flair_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCommunity" ADD CONSTRAINT "UserCommunity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCommunity" ADD CONSTRAINT "UserCommunity_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomFeed" ADD CONSTRAINT "CustomFeed_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomFeedCommunity" ADD CONSTRAINT "CustomFeedCommunity_customFeedId_fkey" FOREIGN KEY ("customFeedId") REFERENCES "CustomFeed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomFeedCommunity" ADD CONSTRAINT "CustomFeedCommunity_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedPost" ADD CONSTRAINT "SavedPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedPost" ADD CONSTRAINT "SavedPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HackathonPost" ADD CONSTRAINT "HackathonPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_hackathonpostId_fkey" FOREIGN KEY ("hackathonpostId") REFERENCES "HackathonPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityVisit" ADD CONSTRAINT "CommunityVisit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityVisit" ADD CONSTRAINT "CommunityVisit_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
