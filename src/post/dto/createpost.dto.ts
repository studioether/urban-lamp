import {IsString, IsMilitaryTime, IsDateString, IsArray, IsNumber, IsNotEmpty} from 'class-validator'

export class CreatePostDto{
    
    @IsString()
    readonly title: string;

    @IsDateString()
    @IsNotEmpty()
    readonly postDate: Date

    //join with comments table
}