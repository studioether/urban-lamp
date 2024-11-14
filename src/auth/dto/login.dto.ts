import {IsEmail, IsNotEmpty, IsStrongPassword} from "class-validator"
import { ApiProperty } from "@nestjs/swagger"



export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string

    @IsStrongPassword()
    @IsNotEmpty()
    @ApiProperty()
    password?: string
}