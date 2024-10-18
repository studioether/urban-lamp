import { Get, Post, Patch, Delete, Param, Body, ParseIntPipe, NotFoundException, ForbiddenException, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CommentsService } from 'src/comments/comments.service';
import { Review } from '@prisma/client';
import { ReviewEntity } from './entities/review.entity';

import { ApiTags, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { CreateReviewtDto } from './dto/review.dto';
import { UpdateReviewDto } from './dto/updatereview.dto';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
// import { Request } from 'express';
import { CommentEntity } from 'src/comments/entities/comment.entity';

@Controller('review')
@ApiTags('review')
export class ReviewController {
    constructor(
        private readonly reviewService: ReviewService,
        private readonly commentService: CommentsService
    ) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({type: ReviewEntity, isArray: true})
    async feed(): Promise<Review[]> { //TODO:reset to find all where userId == user.id
        const reviews = await this.reviewService.findAll()
        return reviews.map((review) => new ReviewEntity(review))
    }

    //TODO: add route for getting all comments under a review.

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({type: ReviewEntity})
    async findOne(@Param('id', ParseIntPipe) id:number):Promise<Review> {
        const review = await this.reviewService.findOne(id)
        if (!review) {
            throw new NotFoundException(`Review with ${id} does not exist`)
        }
        
        return new ReviewEntity(review)
    }

    @Get(':id/comments')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({type: CommentEntity})
    async getComments(@Param('id', ParseIntPipe) reviewId: number) {
        return await this.commentService.findCommentByReviewId(reviewId) //* returns a comment
    }

    @Get(":id/upvote-status")
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({type: ReviewEntity})
    async getUpvoteStatus(@Param('id', ParseIntPipe) id: number, @Req() request) {
        const userId =  request.user.userId
        return this.reviewService.getUpvoteStatus(id, userId)
    }

    @Get(":id/downvote-status")
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({type: ReviewEntity})
    async getDownvoteStatus(@Param('id', ParseIntPipe) id: number, @Req() request) {
        const userId = request.user.userId
        return this.reviewService.getDowvoteStatus(id, userId)
    }

    @Get(":id/bookmark-status")
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({type: ReviewEntity})
    async getBookmarkStatus(@Param('id', ParseIntPipe) id: number, @Req() request) {
        const userId = request.user.userId
        return this.reviewService.getBookmarkStatus(id, userId)
    }

    @Post("new")
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({type: ReviewEntity})
    async createReview(@Body() createReviewDto: CreateReviewtDto, @Req() request): Promise<Review> {
        const userId = request.user.userId
        return new ReviewEntity( await this.reviewService.createReview(createReviewDto, userId))
    }


    @Post(':id/comments')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({ type: ReviewEntity })
    async addComment(@Param('id', ParseIntPipe) id: number, @Body() createCommentDto: CreateCommentDto, @Req() request) {
        const userId = request.user.userId
        const review = await this.reviewService.findOne(id)

        if (!review) {
            throw new NotFoundException(`Review with id ${id} not found`)
        }

        return this.commentService.createComment(createCommentDto, userId, id)
    }

    @Post(':id/upvote')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({type: ReviewEntity})
    async upvoteReview(@Param('id', ParseIntPipe) id: number, @Req() request) {
        const userId = request.user.userId 
        return new ReviewEntity(await this.reviewService.toggleUpvote(id, userId))
    }

    @Post(':id/downvote')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({type: ReviewEntity})
    async downvoteReview(@Param('id', ParseIntPipe) id: number, @Req() request) {
        const userId = request.user.userId
        return new ReviewEntity(await this.reviewService.toggleDownvote(id, userId))
    }

    @Post(':id/bookmark')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({ type: ReviewEntity })
    async toggleBookmark(@Param('id', ParseIntPipe) id: number, @Req() request) {
        const userId = request.user.userId
        return new ReviewEntity(await this.reviewService.toggleBookmarkReview(id, userId))
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({type: ReviewEntity})
    async updateReview(@Param('id', ParseIntPipe) id: number, @Body() updateReviewDto: UpdateReviewDto, @Req() request): Promise<Review> {
        const userId = request.user.userId
        return new ReviewEntity( await this.reviewService.updateReview(id, updateReviewDto, userId))
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({type: ReviewEntity})
    async removeReview(@Param('id', ParseIntPipe) id: number, @Req() request) {
        const userId = request.user.userId
        return new ReviewEntity( await this.reviewService.deleteReview(id, userId))
    }

    @Delete(':id/comments/:commentId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({type: ReviewEntity})
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
