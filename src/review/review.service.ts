import { Injectable, NotFoundException } from '@nestjs/common';
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
    async createReview(createReviewDto: CreateReviewtDto): Promise<Review> {
        const newReview = this.prisma.review.create({
            data: createReviewDto
        })

        return newReview
    }

    async findAll(): Promise<Review[]> {
        const feed = await this.prisma.review.findMany()
        return feed
    }


    async findAllByUser(userId: number): Promise<Review[]> {
        const myReviews = await this.prisma.review.findMany({
            where: {
                authorId: userId
            }
        })

        return myReviews
    }


    async updateReview(reviewId, updateReviewDto: UpdateReviewDto): Promise<Review> {
        const updatedReview = await this.prisma.review.update({
            where: {
                id: reviewId
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
                author: true
            }
        })

        return review
    }


    async deleteReview(reviewId){
        return await this.prisma.review.delete({where: {id: reviewId}})
    }


    async addUpvote(reviewId: number, userId: number): Promise<Review> {
        const review = await this.prisma.review.findUnique({where: {id: reviewId}})
        if (!review) {
            throw new NotFoundException(`Review with id ${reviewId} not found`)
        }

        return this.prisma.review.update({
            where: {
                id: reviewId
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


    async removeUpvote(reviewId: number, userId: number): Promise<Review> {
        const review = await this.prisma.review.findUnique({
            where: {
                id: reviewId
            }
        })

        if (!review) {
            throw new NotFoundException(`Review with id ${reviewId} not found`)
        }

        return this.prisma.review.update({
            where: {
                id: reviewId
            },
            data: {
                upvotes: { decrement: 1 },
                upvotedBy: {disconnect: {id: userId}}
            }
        })
    }
    

    //TODO: this should be further optimized with websocket!!!
    async getUpvoteStatus(reviewId: number, userId: number) {
        const review = this.prisma.review.findUnique({
            where: {
                id: reviewId
            },
            include: {
                upvotedBy: {
                    where: {
                        id: userId
                    }
                }
            }
        })

        return review?.upvotedBy.length > 0
    }
}
