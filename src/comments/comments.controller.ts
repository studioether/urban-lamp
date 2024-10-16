import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comments, Prisma } from '@prisma/client';


import { ApiTags, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';



@Controller('comments')
@ApiTags('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // @Post()
  // create(@Body() createCommentDto: CreateCommentDto) {
  //   return
  // }

  // @Get()
  // findAll() {
  //   return
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
  //   return
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return
  // }
}
