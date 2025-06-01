/*
  Warnings:

  - You are about to drop the `HackathonPost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Request` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "HackathonPost" DROP CONSTRAINT "HackathonPost_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_hackathonpostId_fkey";

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_userId_fkey";

-- DropTable
DROP TABLE "HackathonPost";

-- DropTable
DROP TABLE "Request";

-- CreateTable
CREATE TABLE "CollaborationPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "collabRole" TEXT[],
    "slotsTotal" INTEGER NOT NULL,
    "slotsFilled" INTEGER NOT NULL DEFAULT 0,
    "genderReq" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "authorId" TEXT NOT NULL,

    CONSTRAINT "CollaborationPost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CollaborationPost" ADD CONSTRAINT "CollaborationPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
