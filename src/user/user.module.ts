import { Module} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ReviewModule } from 'src/review/review.module';
import { PrismaModule } from 'src/prisma/prisma.module';


@Module({
  imports: [PrismaModule, ReviewModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
