/*
  Warnings:

  - You are about to drop the column `developerProfileLinks` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "developerProfileLinks",
ADD COLUMN     "Github" TEXT,
ADD COLUMN     "Portfolio" TEXT,
ADD COLUMN     "Twitter" TEXT,
ADD COLUMN     "linkedIn" TEXT,
ADD COLUMN     "location" TEXT;
