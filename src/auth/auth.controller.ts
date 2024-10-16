import { Body, Controller, Post, HttpStatus, HttpCode } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/createuser.dto';
import { UserService } from 'src/user/user.service';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthEntity } from './entities/auth.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';


@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private readonly userService: UserService, private readonly authService: AuthService){}

    @Post("signup")
    @HttpCode(HttpStatus.OK)
    @ApiCreatedResponse({ type: UserEntity })
    async signup(
        @Body() userDto: CreateUserDto
    ): Promise<User> {
        return this.userService.createUser(userDto)
    }

    @Post("login")
    @HttpCode(HttpStatus.OK)
    @ApiCreatedResponse({type: AuthEntity})
    async login(@Body() loginDto: LoginDto) {
        return await this.authService.login(loginDto);
    }
}

