import {IsString, IsMilitaryTime, IsDateString, IsArray, IsNumber, IsNotEmpty, IsOptional} from 'class-validator'



export class UpdatePostDto{
    @IsString()
    @IsOptional()
    title: string;

    @IsDateString()
    postDate: Date;
}