import {  Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class CurrentUser implements NestMiddleware{
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split('')[1]
            try {

                const decodedToken = this.jwtService.verify(token)
                //*validate token and get userId
                const userId = decodedToken.sub
                const user = await this.prisma.user.findUnique({where: {id: userId}})
    
    
                if (!user) {
                    throw new UnauthorizedException("User not found!!")
                }
    
                req['user'] = user
            } catch (error) {
                throw new UnauthorizedException('Invalid Token')
            }
        }
        next()
    }
}