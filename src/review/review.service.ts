import { Injectable } from '@nestjs/common';
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
            }
        })

        return review
    }


    async deleteReview(reviewId){
        return await this.prisma.review.delete({where: {id: reviewId}})
    }
    
}
