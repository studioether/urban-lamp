import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { User } from "@prisma/client";

export class UserEntity implements User{
    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial)
    }
    
    @ApiProperty()
    id: number

    @ApiProperty()
    username: string

    @ApiProperty()
    email: string

    @Exclude()
    password: string

    @ApiProperty()
    createdAt: Date
}
