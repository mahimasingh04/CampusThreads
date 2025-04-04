/*
  Warnings:

  - Added the required column `contentType` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('TEXT', 'IMAGES', 'VIDEOS', 'POLLS');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "contentType" "ContentType" NOT NULL;
