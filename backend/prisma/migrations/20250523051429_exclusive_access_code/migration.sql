/*
  Warnings:

  - A unique constraint covering the columns `[id,accessCode]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Tag_id_accessCode_key" ON "Tag"("id", "accessCode");
