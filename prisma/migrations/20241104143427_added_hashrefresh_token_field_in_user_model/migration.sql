/*
  Warnings:

  - A unique constraint covering the columns `[hashedRefreshToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hashedRefreshToken" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "User_hashedRefreshToken_key" ON "User"("hashedRefreshToken");
