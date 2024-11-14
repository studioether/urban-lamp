import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import {ExtractJwt, Strategy} from 'passport-jwt'
// import { authConstants } from "./auth.constant";
import jwtConfig from "src/config/jwt.config";
import { PayloadType } from "src/types/payload.type";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(jwtConfig.KEY)
        private jwtConfiguration: ConfigType<typeof jwtConfig>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConfiguration.secret
        })
    }


    async validate(payload: PayloadType) {
        //*TODO: REMOVE BEFORE PUSHING!!! console.log('payload:', payload)
        // console.log('jwt strategy, payload', payload)
        return {
            email: payload.email,
            userId: payload.id
        }
    }
}