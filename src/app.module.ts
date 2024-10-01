import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ReviewModule } from './review/review.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from './common/middleware/logger/logger.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

// import config from 'ormconfig';
// import { User } from './user/user.entity';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from 'db/data-source';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { SeedModule } from './seed/seed.module';



@Module({
  imports: [PostModule, UserModule, AuthModule, ReviewModule, LoggerModule, TypeOrmModule.forRoot(dataSourceOptions), BookmarksModule, SeedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {
    console.log("dbName...", this.dataSource.driver)
  }
  configure(consumer: MiddlewareConsumer){
    consumer.apply(LoggerMiddleware).forRoutes()
  }
}
