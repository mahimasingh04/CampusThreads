/*
  Warnings:

  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "college" TEXT,
ADD COLUMN     "developerProfileLinks" TEXT,
ADD COLUMN     "skills" TEXT,
ALTER COLUMN "name" SET NOT NULL;
