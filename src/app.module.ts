import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ReviewModule } from './review/review.module';
import { LoggerModule } from './common/middleware/logger/logger.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { PrismaModule } from './prisma/prisma.module';
import { CommentsModule } from './comments/comments.module';
import { MailerModule } from './mailer/mailer.module';
import configuration from './config/configuration';




@Module({
  imports: [ConfigModule.forRoot(configuration), UserModule, AuthModule, ReviewModule, LoggerModule, PrismaModule, CommentsModule, MailerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor() {}
  configure(consumer: MiddlewareConsumer){
    consumer.apply(LoggerMiddleware).forRoutes()
  }
}
