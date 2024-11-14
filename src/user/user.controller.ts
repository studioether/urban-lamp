import { Controller, Get, Body, Patch, Param, Delete, ParseIntPipe, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateuser.dto';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
// import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { UserEntity } from './entities/user.entity';
import { ReviewEntity } from 'src/review/entities/review.entity';
import { ReviewService } from 'src/review/review.service';
@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly reviewService: ReviewService) {}


  @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ type: ReviewEntity, isArray: true })
  @Get('reviews')
  async getUserReviews(@Req() request) {
    const userId = request.user.userId
    const reviews = await this.reviewService.findAllReviewsByUser(userId)
    return reviews
    // return reviews.map((review) => new ReviewEntity(review))
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReviewEntity, isArray: true })
  @Get('upvotes')
  async getUserUpvotes(@Req() request) {
    const userId = request.user.userId
    const upvotes = await this.userService.getUpvotedReviews(userId)
    return upvotes.map((upvote) => new ReviewEntity(upvote))
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReviewEntity, isArray: true })
  @Get('downvotes')
  async getUserDownvotes(@Req() request) {
    const userId = request.user.userId
    const downvotes = await this.userService.getDownvotedReviews(userId)
    return downvotes.map((downvote) => new ReviewEntity(downvote))
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ReviewEntity, isArray: true })
  @Get('bookmarks')
  async getUserBookmarks(@Req() request) {
    const userId = request.user.userId
    const bookmarks = await this.userService.getUserBookmarks(userId)
    return bookmarks.map((bookmark) => new ReviewEntity(bookmark))
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({type: UserEntity})
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new UserEntity(await this.userService.findOne(id))
    // return this.userService.findOne(+id);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({type: UserEntity, isArray: true})
  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return users.map((user) => new UserEntity(user))
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({type: UserEntity})
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return new UserEntity(await this.userService.updateProfile(id, updateUserDto))
    // return this.userService.update(+id, updateUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({type: UserEntity})
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() request) {
    const userId = request.user.userId
    return new UserEntity(await this.userService.deleteUser(id, userId))
    // return this.userService.remove(+id);
  }
}
