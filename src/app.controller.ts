import { Controller, Get, Req, BadRequestException } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

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
