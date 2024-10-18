-- CreateTable
CREATE TABLE "_UserUpvotedReviews" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserUpvotedReviews_AB_unique" ON "_UserUpvotedReviews"("A", "B");

-- CreateIndex
CREATE INDEX "_UserUpvotedReviews_B_index" ON "_UserUpvotedReviews"("B");

-- AddForeignKey
ALTER TABLE "_UserUpvotedReviews" ADD CONSTRAINT "_UserUpvotedReviews_A_fkey" FOREIGN KEY ("A") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserUpvotedReviews" ADD CONSTRAINT "_UserUpvotedReviews_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
