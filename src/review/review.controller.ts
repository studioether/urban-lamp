import { Get, Post, Patch, Delete, Param, Body, ParseIntPipe, NotFoundException, ForbiddenException,Req, HttpCode, HttpStatus } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CommentsService } from 'src/comments/comments.service';
import { Review } from '@prisma/client';
import { ReviewEntity } from './entities/review.entity';

import { ApiTags, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { CreateReviewtDto } from './dto/review.dto';
import { UpdateReviewDto } from './dto/updatereview.dto';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';
// import { Request } from 'express';
import { CommentEntity } from 'src/comments/entities/comment.entity';

@Controller('review')
@ApiTags('review')
export class ReviewController {
    constructor(
        private readonly reviewService: ReviewService,
        private readonly commentService: CommentsService
    ) { }

    

    //TODO: add route for getting all comments under a review.

    @ApiOkResponse({type: ReviewEntity})
    @Get(':id') 
    async findOne(@Param('id', ParseIntPipe) id:number):Promise<Review> {
        const review = await this.reviewService.findOne(id)
        if (!review) {
            throw new NotFoundException(`Review with ${id} does not exist`)
        }
        
        return new ReviewEntity(review)
    }

    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({type: CommentEntity})
    @Get(':id/comments')
    async getComments(@Param('id', ParseIntPipe) reviewId: number) {
        return await this.commentService.findCommentByReviewId(reviewId) //* returns a comment
    }

    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({type: ReviewEntity})
    @Get(":id/upvote-status")
    async getUpvoteStatus(@Param('id', ParseIntPipe) id: number, @Req() request) {
        const userId =  request.user.userId
        return this.reviewService.getUpvoteStatus(id, userId)
    }

    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({type: ReviewEntity})
    @Get(":id/downvote-status")
    async getDownvoteStatus(@Param('id', ParseIntPipe) id: number, @Req() request) {
        const userId = request.user.userId
        return this.reviewService.getDowvoteStatus(id, userId)
    }

    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({type: ReviewEntity})
    @Get(":id/bookmark-status")
    async getBookmarkStatus(@Param('id', ParseIntPipe) id: number, @Req() request) {
        const userId = request.user.userId
        return this.reviewService.getBookmarkStatus(id, userId)
    }

    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({type: ReviewEntity, isArray: true})
    @Get()
    async feed(): Promise<Review[]> { //TODO:reset to find all where userId == user.id
        const reviews = await this.reviewService.findAll()
        return reviews.map((review) => new ReviewEntity(review))
    }


    @HttpCode(HttpStatus.OK)
    @ApiCreatedResponse({ type: ReviewEntity })
    @Post(':id/comments')
    async addComment(@Param('id', ParseIntPipe) id: number, @Body() createCommentDto: CreateCommentDto, @Req() request) {
        const userId = request.user.userId
        const review = await this.reviewService.findOne(id)

        if (!review) {
            throw new NotFoundException(`Review with id ${id} not found`)
        }

        return this.commentService.createComment(createCommentDto, userId, id)
    }

    @HttpCode(HttpStatus.OK)
    @ApiCreatedResponse({type: ReviewEntity})
    @Post(':id/upvote')
    async upvoteReview(@Param('id', ParseIntPipe) id: number, @Req() request) {
        const userId = request.user.userId
        return new ReviewEntity(await this.reviewService.toggleUpvote(id, userId))
    }

    @HttpCode(HttpStatus.OK)
    @ApiCreatedResponse({type: ReviewEntity})
    @Post(':id/downvote')
    async downvoteReview(@Param('id', ParseIntPipe) id: number, @Req() request) {
        const userId = request.user.userId
        return new ReviewEntity(await this.reviewService.toggleDownvote(id, userId))
    }

    @HttpCode(HttpStatus.OK)
    @ApiCreatedResponse({ type: ReviewEntity })
    @Post(':id/bookmark')
    async toggleBookmark(@Param('id', ParseIntPipe) id: number, @Req() request) {
        const userId = request.user.userId
        return new ReviewEntity(await this.reviewService.toggleBookmarkReview(id, userId))
    }

    @HttpCode(HttpStatus.OK)
    @ApiCreatedResponse({type: ReviewEntity})
    @Post()
    async createReview(@Body() createReviewDto: CreateReviewtDto, @Req() request): Promise<Review> {
        const userId = request.user.userId  
        return new ReviewEntity( await this.reviewService.createReview(createReviewDto, userId))
    }

    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({type: ReviewEntity})
    @Patch(':id')
    async updateReview(@Param('id', ParseIntPipe) id: number, @Body() updateReviewDto: UpdateReviewDto, @Req() request): Promise<Review> {
        const userId = request.user.userId
        return new ReviewEntity( await this.reviewService.updateReview(id, updateReviewDto, userId))
    }

    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({type: ReviewEntity})
    @Delete(':id')
    async removeReview(@Param('id', ParseIntPipe) id: number, @Req() request) {
        const userId = request.user.userId
        return new ReviewEntity( await this.reviewService.deleteReview(id, userId))
    }

    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({type: ReviewEntity})
    @Delete(':id/comments/:commentId')
    async deleteComment(@Param("id", ParseIntPipe) id: number, @Param("commentId", ParseIntPipe) commentId: number, @Req() request) {
        const userId = request.user.userId
        
        const review = await this.reviewService.findOne(id)
        if (!review) {
            throw new NotFoundException()
        }

        const comment = await this.commentService.findOneComment(commentId)
        if (!comment) {
            throw new NotFoundException()
        }

        if (comment.reviewId !== id) {
            throw new ForbiddenException("Comment does not belong to the specified post")
        }

        return this.commentService.removeComment(commentId, userId) //* returns comment
    }
}
