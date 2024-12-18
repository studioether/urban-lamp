import { ApiProperty } from "@nestjs/swagger";

interface userObject {
    userId: number
    username: string
    email: string
}


interface backendTokenObject {
    accessToken: string
    refreshToken: string
}


export class AuthEntity {
    @ApiProperty()
    user: userObject

    @ApiProperty()
    backendTokens: backendTokenObject
}