import {IsString, IsDateString, IsNumber, IsNotEmpty} from 'class-validator'


export class CreateReviewtDto{
    
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string

    
    @IsNumber()
    @IsNotEmpty()
    authorId: number | null
    
    //join with comments table
    @IsDateString()
    @IsNotEmpty()
    postedAt: Date
}