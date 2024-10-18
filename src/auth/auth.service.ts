import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { PayloadType } from 'src/types/payload.type';
import { AuthEntity } from './entities/auth.entity';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private prisma: PrismaService,
        private jwtService: JwtService
    ){}


    async login(loginDto: LoginDto): Promise<AuthEntity> {
        const user = await this.userService.findOneAuth(loginDto)
        const passwordMatched = await bcrypt.compare(
            loginDto.password,
            user.password
        )

        if (passwordMatched) {
            delete user.password
            const payload: PayloadType = {
                email: user.email,
                userId: user.id
            }

            return {
                accessToken: this.jwtService.sign(payload)
            }
        } else {
            throw new UnauthorizedException("couldn't sign you in, passwords don't match")
        }
    }

}
