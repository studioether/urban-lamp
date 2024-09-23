import {IsEmail, IsNotEmpty, IsStrongPassword} from "class-validator"


export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsStrongPassword()
    @IsNotEmpty()
    password: string
}