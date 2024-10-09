import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { authConstants } from './auth.constant';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt-strategy';
import { PrismaModule } from 'src/prisma/prisma.module';


@Module({
  imports: [UserModule, PassportModule, JwtModule.register({
    secret: authConstants.secret,
    signOptions: {
      expiresIn: '1d'
    }
  }), PrismaModule],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
