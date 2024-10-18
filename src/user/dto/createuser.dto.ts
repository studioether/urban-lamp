import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @ApiProperty()
    username: string

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string

    // @IsStrongPassword()
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @ApiProperty()
    password: string
}