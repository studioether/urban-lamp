import { CreateReviewtDto } from './review.dto';
import { PartialType } from '@nestjs/swagger';



export class UpdateReviewDto extends PartialType(CreateReviewtDto){}