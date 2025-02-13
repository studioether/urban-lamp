import { Controller, Get, Req, BadRequestException } from '@nestjs/common';
import { AppService } from './app.service';
// import { RefreshJwtAuthGuard } from './guards/refresh-auth.guard';
// import { JwtAuthGuard } from './guards/jwt.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Req() request) {
    try {
      return request.user
    } catch (error) {
      console.error(error.message)
      throw new BadRequestException("couldn't get profile")
    }
  }
}
