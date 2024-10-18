import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
// import { Observable } from "rxjs";


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    // canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    //     const request = context.switchToHttp().getRequest()
    //     console.log('Incoming token:', request.headers.authorization)
    //     return super.canActivate(context)
    // }
}