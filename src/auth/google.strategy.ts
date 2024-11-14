import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import googleOauthConfig from "src/config/google-oauth.config";
import { AuthService } from "./auth.service";


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        @Inject(googleOauthConfig.KEY)
        private googleConfiguration: ConfigType<typeof googleOauthConfig>,
        private authService: AuthService
    ) {
        super({ 
            clientID: googleConfiguration.clientID,
            clientSecret: googleConfiguration.clientSecret,
            callbackURL: googleConfiguration.callbackURL, //* change callback url in cloud console dashboard and in production
            scope: ['email', 'profile']
        })
    }



    async validate(
        accessToken: string,
        refershToken: string,
        profile: any,
        done: VerifyCallback
    ): Promise<any> {
        // console.log('Google profile', profile)
        const {displayName, emails} = profile
        const user = await this.authService.validateGoogleUser({
            email: emails[0].value,
            username: displayName || emails[0].value.split('@')[0],
            password: ""
        })

        done(null, user)
    }
}