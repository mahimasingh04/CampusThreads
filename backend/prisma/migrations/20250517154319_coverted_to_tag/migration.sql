/*
  Warnings:

  - You are about to drop the column `flairId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the `Flair` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tagId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Flair" DROP CONSTRAINT "Flair_communityId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_flairId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "flairId",
ADD COLUMN     "tagId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Flair";

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;
