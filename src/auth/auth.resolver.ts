import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';
import {
    SignupResponse,
    SignupInput,
    LoginResponse,
    LoginInput
} from "src/graphql"

import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) { }
    

    @Mutation('signup')
    async signupUser(
        @Args("signupInput")
        signupInput: SignupInput
    ): Promise<SignupResponse>{
        return this.userService.create(signupInput)
    }

    @Query('login')
    async loginUser(
        @Args("loginInput")
        loginInput: LoginInput
    ): Promise<LoginResponse>{
        return this.authService.login(loginInput)
    }
}
