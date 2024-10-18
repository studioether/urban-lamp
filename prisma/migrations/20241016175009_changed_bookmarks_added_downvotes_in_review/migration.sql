/*
  Warnings:

  - You are about to drop the column `bookmarkedByUser` on the `Review` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_bookmarkedByUser_fkey";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "bookmarkedByUser",
ADD COLUMN     "bookmarks" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "_UserReviewBookmarks" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_UserDownvotedReviews" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserReviewBookmarks_AB_unique" ON "_UserReviewBookmarks"("A", "B");

-- CreateIndex
CREATE INDEX "_UserReviewBookmarks_B_index" ON "_UserReviewBookmarks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserDownvotedReviews_AB_unique" ON "_UserDownvotedReviews"("A", "B");

-- CreateIndex
CREATE INDEX "_UserDownvotedReviews_B_index" ON "_UserDownvotedReviews"("B");

-- AddForeignKey
ALTER TABLE "_UserReviewBookmarks" ADD CONSTRAINT "_UserReviewBookmarks_A_fkey" FOREIGN KEY ("A") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserReviewBookmarks" ADD CONSTRAINT "_UserReviewBookmarks_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserDownvotedReviews" ADD CONSTRAINT "_UserDownvotedReviews_A_fkey" FOREIGN KEY ("A") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserDownvotedReviews" ADD CONSTRAINT "_UserDownvotedReviews_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
