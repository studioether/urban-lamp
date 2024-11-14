import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { PayloadType } from 'src/types/payload.type';
import { AuthEntity } from './entities/auth.entity';
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from 'src/user/dto/createuser.dto';
import refreshJwtConfig from 'src/config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import * as argon2 from 'argon2'


@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private prisma: PrismaService,
        private jwtService: JwtService,
        @Inject(refreshJwtConfig.KEY) private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>
    ){}


    async validateUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email)
        if(!user) throw new UnauthorizedException("user not found!")
        
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            throw new UnauthorizedException("Invalid credentials")
        }

        return { userId: user.id }
    }

    async signUp(createUser: CreateUserDto): Promise<AuthEntity>{
        const user = await this.userService.createUser(createUser)
        
        const {accessToken, refreshToken} = await this.generateTokens(user.id, user.email)
        const hashedRefreshToken = await argon2.hash(refreshToken)
        await this.userService.updateHashedRefreshToken(user.id, hashedRefreshToken)
        return {
            accessToken,
            refreshToken
        }
    }

    async login(loginDto: LoginDto): Promise<AuthEntity> {
        const user = await this.userService.findOneAuth(loginDto)

        if (!user) {
            throw new UnauthorizedException("User not found!")
        }

        if (!loginDto.password) {
            const { accessToken, refreshToken } = await this.generateTokens(user.id, user.email)
            // console.log('access-token',accessToken)
            // console.log('refresh-token',refreshToken)

            const hashedRefreshToken = await argon2.hash(refreshToken)
            await this.userService.updateHashedRefreshToken(user.id, hashedRefreshToken)
            return {
                accessToken,
                refreshToken
            }
        }

        const passwordMatched = await bcrypt.compare(
            loginDto.password,
            user.password
        )


        if (passwordMatched) {
            delete user.password

            const { accessToken, refreshToken } = await this.generateTokens(user.id, user.email)

            const hashedRefreshToken = await argon2.hash(refreshToken)
            await this.userService.updateHashedRefreshToken(user.id, hashedRefreshToken)
            return {
                accessToken,
                refreshToken
            }
            
        } else {
            throw new UnauthorizedException("couldn't sign you in, passwords don't match")
        }
            
    }
 
    async validateGoogleUser(GoogleUser: CreateUserDto) {
        //* check if user email exists in db
        const user = await this.userService.findByEmail(GoogleUser.email)
        if (user) {
            return user
        } else {     
            return await this.userService.createUser(GoogleUser)
        }
    }


    async generateTokens(userId: number, email: string) {
        const payload: PayloadType = {id: userId, email}
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload, this.refreshTokenConfig)
        ])

        return {
            accessToken,
            refreshToken
        }
    }



    async refreshToken(userId: number) {
        const user = await this.userService.findOne(userId)
        const { accessToken, refreshToken } = await this.generateTokens(userId, user.email)
        const hashedRefreshToken = await argon2.hash(refreshToken)
        await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken)
        return {
            accessToken,
            refreshToken
        }
    }

    async validateRefreshToken(userId: number, refreshToken: string) {
        // console.log("authuserid", userId)
        const user = await this.userService.findOne(userId)

        // console.log('authuser', user)
        if (!user || !user.hashedRefreshToken) {
            throw new UnauthorizedException("Invalide Refresh token!!")
        }

        const refreshTokenMatches = await argon2.verify(user.hashedRefreshToken, refreshToken)
        // console.log(refreshTokenMatches)

        if(!refreshTokenMatches) throw new UnauthorizedException("Invalid refresh token")
        
        
        return {
            email: user.email,
            userId: user.id
        }
    }


    async signOut(userId: number) {
        await this.userService.updateHashedRefreshToken(userId, null)
    }

}
