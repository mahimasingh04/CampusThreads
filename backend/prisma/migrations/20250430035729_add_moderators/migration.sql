

-- Create the CommunityModerator join table
CREATE TABLE "CommunityModerator" (
    "userId" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    
    -- Define primary key (composite of userId + communityId)
    CONSTRAINT "CommunityModerator_pkey" PRIMARY KEY ("userId", "communityId"),

    -- Foreign key to User
    CONSTRAINT "CommunityModerator_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,

    -- Foreign key to Community
    CONSTRAINT "CommunityModerator_communityId_fkey" 
    FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE
);

-- Optional: Add index for faster queries on communityId
CREATE INDEX "CommunityModerator_communityId_idx" ON "CommunityModerator" ("communityId");