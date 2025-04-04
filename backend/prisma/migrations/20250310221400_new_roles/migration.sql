/*
  Warnings:

  - Added the required column `ownerId` to the `Community` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rules` to the `Community` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'MODERATOR', 'ADMIN');

-- AlterTable
ALTER TABLE "Community" ADD COLUMN     "joinRequests" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ownerId" TEXT NOT NULL,
ADD COLUMN     "rules" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'USER';
