-- DropForeignKey
ALTER TABLE "CommunityModerator" DROP CONSTRAINT "CommunityModerator_communityId_fkey";

-- DropForeignKey
ALTER TABLE "CommunityModerator" DROP CONSTRAINT "CommunityModerator_userId_fkey";

-- DropIndex
DROP INDEX "CommunityModerator_communityId_idx";

-- AddForeignKey
ALTER TABLE "CommunityModerator" ADD CONSTRAINT "CommunityModerator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityModerator" ADD CONSTRAINT "CommunityModerator_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;
