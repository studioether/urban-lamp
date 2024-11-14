import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Comments } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService
  ) { }
  
  async createComment(createCommentDto: CreateCommentDto, userId: number, reviewId: number): Promise<Comments> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    })

    if (!user) {
      throw new NotFoundException(`this user with id ${userId} doesn't exist`)
    }

    

    const reviewData = {
      comment: createCommentDto.comment,
      reviewId,
      authorId: userId
    }


    const newComment = await this.prisma.comments.create({
      data: reviewData
    })

    return newComment
  }

  findAll() {
    return `This action returns all comments`;
  }

  findOneComment(id: number) {
    return this.prisma.comments.findUnique({
      where: {
        id: id
      }
    })
  }


  findCommentByReviewId(reviewId: number): Promise<Comments[]>{
    return this.prisma.comments.findMany({
      where: {
        reviewId
      },
      include: { //not user if I should actuall have this there I'll have to check.
        "review": true,
        "author": true
      }
    })
  }

  // async updateComment(id: number, updateCommentDto: UpdateCommentDto): Promise<Comments> {
  //   const updatedComment = await this.prisma.comments.update({
  //     where: {
  //       id: id
  //     },
  //     data: updateCommentDto
  //   })

  //   return updatedComment
  // }

  async removeComment(id: number, userId: number): Promise<Comments> {

    const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            throw new NotFoundException(`this user with id ${userId} doesn't exist`)
    }
    
    const comment = await this.prisma.comments.findUnique({
      where: {id}
    })

    if (comment.authorId !== user.id) {
      throw new UnauthorizedException("You can't delete this comment!!!")
    }

    try {
      const deletedComment = await this.prisma.comments.delete({where: {id: id}})
      return deletedComment
    } catch (error) {
      throw new NotFoundException(`comment with ${id} not found`)
    }
  }
}
