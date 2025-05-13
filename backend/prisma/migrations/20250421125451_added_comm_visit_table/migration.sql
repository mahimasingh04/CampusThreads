/*
  Warnings:

  - You are about to drop the `CommunityVisit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CommunityVisit" DROP CONSTRAINT "CommunityVisit_communityId_fkey";

-- DropForeignKey
ALTER TABLE "CommunityVisit" DROP CONSTRAINT "CommunityVisit_userId_fkey";

-- AlterTable
ALTER TABLE "HackathonPost" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- DropTable
DROP TABLE "CommunityVisit";

-- CreateTable
CREATE TABLE "communityVisit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    "visitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "communityVisit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "communityVisit_userId_idx" ON "communityVisit"("userId");

-- CreateIndex
CREATE INDEX "communityVisit_visitedAt_idx" ON "communityVisit"("visitedAt");

-- CreateIndex
CREATE UNIQUE INDEX "communityVisit_userId_communityId_key" ON "communityVisit"("userId", "communityId");

-- AddForeignKey
ALTER TABLE "communityVisit" ADD CONSTRAINT "communityVisit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communityVisit" ADD CONSTRAINT "communityVisit_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

