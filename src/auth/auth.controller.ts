import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/createuser.dto';
import { UserService } from 'src/user/user.service';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthEntity } from './entities/auth.entity';
import { UserEntity } from 'src/user/user.entity';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';


@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private readonly userService: UserService, private readonly authService: AuthService){}

    @Post("signup")
    @ApiCreatedResponse({ type: UserEntity })
    signup(@Body() userDto: CreateUserDto): Promise<User> {
        return this.userService.createUser(userDto)
    }

    @Post("login")
    @ApiCreatedResponse({type: AuthEntity})
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto)
    }
}

