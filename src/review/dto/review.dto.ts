import { IsString, IsNumber, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';


export class CreateReviewtDto{
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty({required: true})
    title: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({required: true})
    content: string

    
    @ApiProperty({required: false, nullable: true})
    authorId?: number | null
}