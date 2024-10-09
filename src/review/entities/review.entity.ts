import { ApiProperty } from "@nestjs/swagger";
import { Review} from "@prisma/client";



export class ReviewEntity implements Review {

    @ApiProperty()
    id: number

    @ApiProperty()
    content: string

    @ApiProperty({required: false, nullable: true}) //*TODO: for now. change this to be required later on when all is fixed!!!
    authorId: number | null

    @ApiProperty({required: false, nullable: true})
    bookmarkedByUser: number | null;

    @ApiProperty()
    upvotes: number

    @ApiProperty()
    downvotes: number

    @ApiProperty({isArray: true})
    comments: []

    @ApiProperty()
    createdAt: Date

    @ApiProperty()
    updatedAt: Date

}