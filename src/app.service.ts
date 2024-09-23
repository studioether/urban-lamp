import { Get, Injectable, UseGuards, Request } from '@nestjs/common';
import { JwtGuard } from './guards/jwt.guard';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  @Get("profile")
  @UseGuards(JwtGuard)
  profile(@Request() req,) {
    return req.user
  }
}
