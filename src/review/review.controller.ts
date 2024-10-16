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
import { Request } from 'express';
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
    @ApiOkResponse({type: ReviewEntity, isArray: true})
    async feed(): Promise<Review[]> { //TODO:reset to find all where userId == user.id
        const reviews = await this.reviewService.findAll()
        return reviews.map((review) => new ReviewEntity(review))
    }

    //TODO: add route for getting all comments under a review.

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({type: ReviewEntity})
    async findOne(@Param('id', ParseIntPipe) id:number):Promise<Review> {
        const review = await this.reviewService.findOne(id)
        if (!review) {
            throw new NotFoundException(`Review with ${id} does not exist`)
        }
        
        return new ReviewEntity(review)
    }

    @Get('user/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({type: ReviewEntity, isArray: true})
    async findReviewsByUser(@Param('id', ParseIntPipe) id: number): Promise<Review[]> {
        const reviews = await this.reviewService.findAllByUser(id)
        return reviews.map((review) => new ReviewEntity(review));
    }

    @Get(':id/comments')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({type: CommentEntity})
    async getComments(@Param('id', ParseIntPipe) reviewId: number) {
        return await this.commentService.findCommentByReviewId(reviewId) //* returns a comment
    }

    @Get("id/upvote-status")
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({type: ReviewEntity})
    async getUpvoteStatus(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
        const userId = req.user['id']  //! assuming user Id is attached to the request, instances are liable to change
        return this.reviewService.getUpvoteStatus(id, userId)
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiCreatedResponse({type: ReviewEntity})
    async createReview(@Body() createReviewDto: CreateReviewtDto): Promise<Review> {
        return new ReviewEntity( await this.reviewService.createReview(createReviewDto))
    }


    @Post(':id/comments')
    @HttpCode(HttpStatus.OK)
    @ApiCreatedResponse({ type: ReviewEntity })
    async addComment(@Param('id', ParseIntPipe) reviewId: number, @Body() createCommentDto: CreateCommentDto) {
        const review = await this.reviewService.findOne(reviewId)
        if (!review) {
            throw new NotFoundException(`Review with id ${reviewId} not found`)
        }

        return this.commentService.createComment(createCommentDto)
    }

    @Post(':id/upvote')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({type: ReviewEntity})
    async upvoteReview(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
        const userId = req.user['id'] //! assuming user Id is attached to the request, instances are liable to change
        return new ReviewEntity(await this.reviewService.addUpvote(id, userId))
    }

    @Patch(":id")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({type: ReviewEntity})
    async updateReview(@Param('id', ParseIntPipe) id: number, @Body() updateReviewDto: UpdateReviewDto): Promise<Review> {
        return new ReviewEntity( await this.reviewService.updateReview(id, updateReviewDto))
    }

    @Delete(":id")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({type: ReviewEntity})
    async removeReview(@Param('id', ParseIntPipe) id: number) {
        return new ReviewEntity( await this.reviewService.deleteReview(id))
    }

    @Delete(":id/comments/:commentId")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({type: ReviewEntity})
    async deleteComment(@Param("id", ParseIntPipe) id: number, @Param("commentId", ParseIntPipe) commentId: number) {
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

        return this.commentService.removeComment(commentId) //* returns comment
    }

    @Delete(":id/upvote")
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({type: ReviewEntity})
    async removeUpvote(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
        const userId = req.user['id']  //! assuming user Id is attached to the request, instances are liable to change
        return new ReviewEntity( await this.reviewService.removeUpvote(id, userId))
    }
}
