import { Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReviewtDto } from './dto/review.dto';
import { Review } from '@prisma/client';
import { UpdateReviewDto } from './dto/updatereview.dto';

@Injectable()
export class ReviewService {
    constructor(
        private prisma: PrismaService
    ) { }
    

    //create a new review
    async createReview(createReviewDto: CreateReviewtDto, userId: number): Promise<Review> {
        //*confirm that the user exist
        // console.log("userId", userId)
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            throw new NotFoundException(`this user with id ${userId} doesn't exist`)
        }

        createReviewDto.authorId = user.id
        const newReview = this.prisma.review.create({
            data: createReviewDto
        })

        return newReview
    }

    async findAll(): Promise<Review[]> {
        const feed = await this.prisma.review.findMany({
            include: {
                author: true,
                comments: true
            }
        })
        return feed
    }


    async findAllReviewsByUser(userId: number): Promise<Review[]> {
        const myReviews = await this.prisma.review.findMany({
            where: {
                authorId: userId
            },
            include: {
                author: true,
                comments: true
            }
        })

        return myReviews
    }


    async updateReview(reviewId, updateReviewDto: UpdateReviewDto, userId): Promise<Review> {
        //* check if user is the author of the review
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            throw new NotFoundException("this user doesn't exist!!!")
        }

        const review = await this.prisma.review.findUnique({
            where: {id: reviewId}
        })

        if (review.authorId !== user.id) {
            throw new UnauthorizedException("You can't make edits to this review!!")
        }

        const updatedReview = await this.prisma.review.update({
            where: {
                id: review.id
            },
            data: updateReviewDto
        })

        return updatedReview
    }


    async findOne(reviewId: number): Promise<Review>{
        const review = await this.prisma.review.findUnique({
            where: {
                id: reviewId
            },
            include: {
                author: true,
                comments: true
            }
        })

        return review
    }


    async deleteReview(reviewId, userId){
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            throw new NotFoundException(`this user with id ${userId} doesn't exist`)
        }
        const review = await this.prisma.review.findUnique({
            where: {id: reviewId}
        })

        if (review.authorId !== user.id) {
            throw new UnauthorizedException("you can't delete this review!!")
        }

        return await this.prisma.review.delete({where: {id: review.id}})
    }


    async toggleUpvote(reviewId: number, userId: number): Promise<Review> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            throw new NotFoundException(`this user with id ${userId} doesn't exist`)
        }

        const review = await this.prisma.review.findUnique({
            where: { id: reviewId },
            include: {
                upvotedBy: {
                    where: {
                        id: userId
                    }
                }
            }
        })

        if (!review) {
            throw new NotFoundException(`Review with id ${reviewId} not found`)
        }

        //*TODO: Make sure the review hasn't already been downvoted by this user


        const isupVoted = review.upvotedBy.length > 0

        if (isupVoted) {
            return await this.prisma.review.update({
            where: {
                id: review.id
            },
            data: {
                upvotes: { decrement: 1 },
                upvotedBy: {
                    disconnect: {
                        id: userId
                    }
                }   
            }
        })
        } else {
            return this.prisma.review.update({
            where: {
                id: review.id
            },
            data: {
                upvotes: { increment: 1 },
                upvotedBy: {
                    connect: {
                        id: userId
                    }
                }   
            }
        })
        }

        
    }

    

    //TODO: this should be further optimized with websocket!!!
    async getUpvoteStatus(reviewId: number, userId: number): Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            throw new NotFoundException(`this user with id ${userId} doesn't exist`)
        }

        const review = this.prisma.review.findUnique({
            where: {
                id: reviewId
            },
            include: {
                upvotedBy: {
                    where: {
                        id: user.id
                    }
                }
            }
        })

        return review?.upvotedBy.length > 0
    }


    async toggleDownvote(reviewId: number, userId: number): Promise<Review>{
        const user = await this.prisma.user.findUnique({
            where: {id: userId}
        })

        if (!user) {
            throw new NotFoundException(`the user ${userId} could not be found`)
        }

        //*TODO: Make sure the review hasn't already been upvoted by this user

        const review = await this.prisma.review.findUnique({
            where: { id: reviewId },
            include: {
                downvotedBy: {
                    where: {
                        id: userId
                    }
                }
            }
        })

        if (!review) {
            throw new NotFoundException(`This review with id ${reviewId} could not be found`)
        }

        const isDownvoted = review.downvotedBy.length > 0

        if (isDownvoted) {
            return await this.prisma.review.update({
            where: {
                id: reviewId
            },
            data: {
                downvotes: { decrement: 1 },
                downvotedBy: {
                    disconnect: {
                        id: userId
                    }
                }
            }
        })
        } else {
            return await this.prisma.review.update({
            where: {
                id: reviewId
            },
            data: {
                downvotes: { increment: 1 },
                downvotedBy: {
                    connect: {
                        id: userId
                    }
                }
            }
        })
        }  
    }
    
    //*TODO: update with websocket!!!
    async getDowvoteStatus(reviewId: number, userId: number): Promise<boolean>{
        const user = await this.prisma.user.findUnique({
            where: {id: userId}
        })


        if (!user) {
            throw new NotFoundException()
        }

        const review = await this.prisma.review.findUnique({
            where: {id: reviewId}
        })

        if (!review) {
            throw new NotFoundException()
        }


        const downVotedReview =  this.prisma.review.findUnique({
            where: { id: review.id },
            include: {upvotedBy: {where: {id: user.id}}}
        })

        return downVotedReview?.downvotedBy.length > 0
    }

    async toggleBookmarkReview(reviewId: number, userId: number): Promise<Review>{
         const user = await this.prisma.user.findUnique({
            where: {id: userId}
        })


        if (!user) {
            throw new NotFoundException(`user ${userId} can't be found`)
        }


        

        const reviewBookmarks = await this.prisma.review.findUnique({
            where: {
                id: reviewId
            },
            include: {
                bookmarkedBy: {
                    where: {
                        id: userId
                    }
                }
            }
        })


        if (!reviewBookmarks) {
            throw new NotFoundException(`reviwe ${reviewId} can't be found`)
        }

        const isBookmarked = reviewBookmarks.bookmarkedBy.length > 0

        if (isBookmarked) {
            return await this.prisma.review.update({
               where: { id: reviewId },
                data: {
                    bookmarks: { decrement: 1 },
                    bookmarkedBy: { disconnect: { id: user.id}}
                },
                include: {
                    bookmarkedBy: true
                }
            })
        } else {
            return await this.prisma.review.update({
               where: { id: reviewId },
                data: {
                    bookmarks: { increment: 1 },
                    bookmarkedBy: { connect: { id: user.id}}
                },
                include: {
                    bookmarkedBy: true
                }
            })
        }
        
    }


    async getBookmarkStatus(reviewId: number, userId: number): Promise<boolean> {
         const user = await this.prisma.user.findUnique({
            where: {id: userId}
        })


        if (!user) {
            throw new NotFoundException()
        }

        
        const review = await this.prisma.review.findUnique({
            where: {id: reviewId}
        })

        if (!review) {
            throw new NotFoundException()
        }

        const bookmarkedReview =  this.prisma.review.findUnique({
            where: { id: review.id },
            include: {bookmarkedBy: {where: {id: user.id}}}
        })

        return bookmarkedReview?.bookmarkedBy.length > 0
    }
}
