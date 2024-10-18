import { Controller, Get, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateuser.dto';


import { ApiTags, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { UserEntity } from './entities/user.entity';
import { ReviewEntity } from 'src/review/entities/review.entity';
import { ReviewService } from 'src/review/review.service';
@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly reviewService: ReviewService) {}


  @Get('all')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({type: UserEntity, isArray: true})
  async findAll() {
    const users = await this.userService.findAll();
    return users.map((user) => new UserEntity(user))
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({type: UserEntity})
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new UserEntity(await this.userService.findOne(id))
    // return this.userService.findOne(+id);
  }

  @Get('reviews')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ReviewEntity, isArray: true })
  async getUserReviews(@Req() request) {
    const userId = await request.user.userId
    const reviews = await this.reviewService.findAllReviewsByUser(userId)
    return reviews.map((review) => new ReviewEntity(review))
  }

  @Get('upvotes')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ReviewEntity, isArray: true })
  async getUserUpvotes(@Req() request) {
    const userId = await request.user.userId
    const upvotes = await this.userService.getUpvotedReviews(userId)
    return upvotes.map((upvote) => new ReviewEntity(upvote))
  }

  @Get('downvotes')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ReviewEntity, isArray: true })
  async getUserDownvotes(@Req() request) {
    const userId = await request.user.userId
    const downvotes = await this.userService.getDownvotedReviews(userId)
    return downvotes.map((downvote) => new ReviewEntity(downvote))
  }

  @Get('bookmarks')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ReviewEntity, isArray: true })
  async getUserBookmarks(@Req() request) {
    const userId = await request.user.userId
    const bookmarks = await this.userService.getUserBookmarks(userId)
    return bookmarks.map((bookmark) => new ReviewEntity(bookmark))
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({type: UserEntity})
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return new UserEntity(await this.userService.updateProfile(id, updateUserDto))
    // return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({type: UserEntity})
  async remove(@Param('id', ParseIntPipe) id: number, @Req() request) {
    const userId = request.user.userId
    return new UserEntity(await this.userService.deleteUser(id, userId))
    // return this.userService.remove(+id);
  }
}
