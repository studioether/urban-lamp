import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';

@Module({
  controllers: [PostController],
  providers: [PostService, PostResolver]
})
export class PostModule {}
