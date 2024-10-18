import { Controller, Get, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("profile")
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() request) {
    try {      
      return request.user
    } catch (error) {
      console.error(error.message)
      throw new BadRequestException("couldn't get profile")
    }
  }
}
