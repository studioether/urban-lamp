import { Get, Post, Patch, Delete, Param, Body, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Review } from '@prisma/client';
import { ReviewEntity } from './entities/review.entity';

import { ApiTags, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { CreateReviewtDto } from './dto/review.dto';
import { UpdateReviewDto } from './dto/updatereview.dto';

@Controller('review')
@ApiTags('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @Get()
    @ApiOkResponse({type: ReviewEntity, isArray: true})
    feed(): Promise<Review[]> { //TODO:reset to find all where userId == user.id
        return this.reviewService.findAll()
    }

    //TODO: add route for getting all comments under a review.

    @Get(':id')
    @ApiOkResponse({type: ReviewEntity})
    async findOne(@Param('id', ParseIntPipe) id:number):Promise<Review> {
        const review = this.reviewService.findOne(id)
        if (!review) {
            throw new NotFoundException(`Review with ${id} does not exist`)
        }
        
        return review
    }

    @Get('user/:id')
    @ApiOkResponse({type: ReviewEntity, isArray: true})
    async findReviewsByUser(@Param('id', ParseIntPipe) id: number): Promise<Review[]> {
        return this.reviewService.findAllByUser(id)
    }

    @Post()
    @ApiCreatedResponse({type: ReviewEntity})
    createReview(@Body() createReviewDto: CreateReviewtDto): Promise<Review> {
        return this.reviewService.createReview(createReviewDto)
    }


    @Patch(":id")
    @ApiOkResponse({type: ReviewEntity})
    updateReview(@Param('id', ParseIntPipe) id: number, @Body() updateReviewDto: UpdateReviewDto): Promise<Review> {
        return this.reviewService.updateReview(id, updateReviewDto)
    }

    @Delete(":id")
    @ApiOkResponse({type: ReviewEntity})
    removeReview(@Param('id', ParseIntPipe) id: number) {
        return this.reviewService.deleteReview(id)
    }
}
