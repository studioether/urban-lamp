import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {ExtractJwt, Strategy} from 'passport-jwt'
import { authConstants } from "./auth.constant";
import { PayloadType } from "src/types/payload.type";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: authConstants.secret
        })
    }


    async validate(payload: PayloadType) {
        return {
            email: payload.email,
            userId: payload.userId
        }
    }
}