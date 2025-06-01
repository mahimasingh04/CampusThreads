/*
  Warnings:

  - You are about to drop the column `rolesNeeded` on the `CollaborationPost` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CollaborationPost" DROP COLUMN "rolesNeeded";

-- CreateTable
CREATE TABLE "RolesNeed" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "collabPostId" TEXT,

    CONSTRAINT "RolesNeed_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RolesNeed" ADD CONSTRAINT "RolesNeed_collabPostId_fkey" FOREIGN KEY ("collabPostId") REFERENCES "CollaborationPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;
