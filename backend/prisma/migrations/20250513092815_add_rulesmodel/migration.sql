/*
  Warnings:

  - You are about to drop the column `rules` on the `Community` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Community" DROP COLUMN "rules";

-- CreateTable
CREATE TABLE "Rules" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,

    CONSTRAINT "Rules_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Rules" ADD CONSTRAINT "Rules_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;
