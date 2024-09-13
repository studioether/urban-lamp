import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewResolver } from './review.resolver';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, ReviewResolver]
})
export class ReviewModule {}
