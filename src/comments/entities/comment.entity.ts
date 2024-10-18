import { ApiProperty } from "@nestjs/swagger";
import { Comments } from "@prisma/client";

export class CommentEntity implements Comments {

    @ApiProperty()
    id: number
    
    @ApiProperty()
    comment: string

    @ApiProperty()
    reviewId: number | null

    @ApiProperty()
    authorId: number | null

    @ApiProperty()
    createdAt: Date
}


