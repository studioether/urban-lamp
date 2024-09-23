import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/createuser.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly userService: UserService, private readonly authService: AuthService){}

    @Post("signup")
    signup(@Body() userDto: CreateUserDto): Promise<User> {
        return this.userService.createUser(userDto)
    }

    @Post("login")
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto)
    }
}

