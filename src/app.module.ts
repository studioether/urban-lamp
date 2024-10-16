import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ReviewModule } from './review/review.module';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from './common/middleware/logger/logger.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

// import config from 'ormconfig';
// import { User } from './user/user.entity';
// import { DataSource } from 'typeorm';
// import { dataSourceOptions } from 'db/data-source';
// import { SeedModule } from './seed/seed.module';
import { PrismaModule } from './prisma/prisma.module';
import { CommentsModule } from './comments/comments.module';
import { CurrentUser } from './common/middleware/currentuser.middleware';
import { JwtService } from '@nestjs/jwt';



@Module({
  imports: [UserModule, AuthModule, ReviewModule, LoggerModule, /*TypeOrmModule.forRoot(dataSourceOptions),  SeedModule,*/ PrismaModule, CommentsModule],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule implements NestModule {
  constructor() {}
  configure(consumer: MiddlewareConsumer){
    consumer.apply(LoggerMiddleware).forRoutes()
    consumer.apply(CurrentUser).forRoutes('*')
  }
}
