/*
  Warnings:

  - A unique constraint covering the columns `[accessCode]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,communityId]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdBy` to the `Tag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "accessCode" TEXT,
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "Tag_accessCode_key" ON "Tag"("accessCode");

-- CreateIndex
CREATE INDEX "Tag_communityId_idx" ON "Tag"("communityId");

-- CreateIndex
CREATE INDEX "Tag_isPublic_idx" ON "Tag"("isPublic");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_communityId_key" ON "Tag"("name", "communityId");

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
