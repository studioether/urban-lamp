import {  Body, Controller, Post, HttpStatus, HttpCode, UseGuards, Get, Req, Res, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/createuser.dto';
import { UserService } from 'src/user/user.service';
// import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthEntity } from './entities/auth.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { GoogleOAuthGuard } from 'src/guards/google-oauth.guard';
import { Public } from 'src/decorators/public.decorator';
import { RefreshJwtAuthGuard } from 'src/guards/refresh-auth.guard';
// import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { LocalAuthGuard } from 'src/guards/local.guard';




@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private readonly userService: UserService, private readonly authService: AuthService){}

    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiCreatedResponse({ type: UserEntity })
    @Post("signup")
    signup(
        @Body() userDto: CreateUserDto
    ){
        return this.authService.signUp(userDto)
    }

    @Public()
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiCreatedResponse({type: AuthEntity})
    @Post("login")
    async login(@Body() loginDto: LoginDto) {
        return await this.authService.login(loginDto);
    }
    
    // @Public()
    @UseGuards(RefreshJwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post("refresh")
    refreshToken(@Req() req) {
        try {
                const userId = req.user.userId
                return this.authService.refreshToken(userId)
        } catch (error) {
            console.error(error.message)
            throw new BadRequestException("couldn't get token")
        }
    }

    @Public()
    @Post("signout")
    signOut(@Req() req) {
        return this.authService.signOut(req.user.userId)
    }

    @Public()
    @UseGuards(GoogleOAuthGuard)
    @Get("google/login")
    googleLogin() {
        return {msg: 'Google Authentication'}
    }

    @Public()
    @UseGuards(GoogleOAuthGuard)
    @Get('google/callback')
    async googleCallback(@Req() req, @Res() res) {
        console.log('Request user:', req.user);
        // console.log('Full request:', req);

        if (!req.user) {
            console.error('No user data received from Google');
            // return res.redirect('http://localhost:5173/auth-error');
        }

        // Check if email exists
        if (!req.user.email) {
            console.error('No email received from Google');
            // return res.redirect('http://localhost:5173/auth-error');
        }

        const loginDto = {
            email: req.user.email as string
        }
        const response = await this.authService.login(loginDto)
        // res.redirect(`http://localhost:5173?token=${response.accessToken}`)
        res.redirect(`http://localhost:3000/api/auth/google/callback?accessToken=${response.backendTokens.accessToken}&refreshToken=${response.backendTokens.refreshToken}`)
    }

}

