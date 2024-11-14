import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import {ExtractJwt, Strategy} from 'passport-jwt'
// import { authConstants } from "./auth.constant";
import refreshJwtConfig from "src/config/refresh-jwt.config";
import { PayloadType } from "src/types/payload.type";
import { AuthService } from "./auth.service";


@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, "refresh-jwt") {
    constructor(
        @Inject(refreshJwtConfig.KEY)
        private refreshJwtConfiguration: ConfigType<typeof refreshJwtConfig>,
        private authService: AuthService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: refreshJwtConfiguration.secret,
            passReqToCallback: true
        })
    }


    async validate(req: Request, payload: PayloadType) {
        // console.log('refresh-id-type',typeof payload.id)
        // console.log("refresh strategy payload", payload)
        // console.log("request", req)
        const refreshToken = req.get("authorization").replace("Bearer", "").trim()
        const userId = payload.id
        return this.authService.validateRefreshToken(userId, refreshToken)
    }
}