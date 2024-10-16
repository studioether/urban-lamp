import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsString } from "class-validator";



export class CreateCommentDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    comment: string

    @ApiProperty()
    reviewId: number | null

    @ApiProperty()
    authorId: number | null

    @ApiProperty()
    @IsDateString()
    createdAt: Date
}
