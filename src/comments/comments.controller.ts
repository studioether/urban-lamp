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

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return
    // return this.commentsService.create(createCommentDto);
  }

  @Get()
  findAll() {
    return
    // return this.commentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return
    // return this.commentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return
    // return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return
    // return this.commentsService.remove(+id);
  }
}
