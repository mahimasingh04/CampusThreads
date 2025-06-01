/*
  Warnings:

  - Added the required column `spotsLeft` to the `CollaborationPost` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `rolesNeeded` on the `CollaborationPost` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "CollaborationPost" ADD COLUMN     "spotsLeft" INTEGER NOT NULL,
DROP COLUMN "rolesNeeded",
ADD COLUMN     "rolesNeeded" TEXT NOT NULL;
