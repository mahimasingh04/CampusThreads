/*
  Warnings:

  - The `rolesNeeded` column on the `CollaborationPost` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "CollaborationPost" DROP COLUMN "rolesNeeded",
ADD COLUMN     "rolesNeeded" TEXT[];
