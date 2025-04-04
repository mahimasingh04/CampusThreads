-- CreateTable
CREATE TABLE "CustomFeed" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomFeed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomFeedCommunity" (
    "customFeedId" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomFeedCommunity_pkey" PRIMARY KEY ("customFeedId","communityId")
);

-- AddForeignKey
ALTER TABLE "CustomFeed" ADD CONSTRAINT "CustomFeed_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomFeedCommunity" ADD CONSTRAINT "CustomFeedCommunity_customFeedId_fkey" FOREIGN KEY ("customFeedId") REFERENCES "CustomFeed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomFeedCommunity" ADD CONSTRAINT "CustomFeedCommunity_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
