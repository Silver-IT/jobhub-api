import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '../users/users.module';
import { EmailModule } from '../email/email.module';
import { IdeaBoardModule } from '../idea-board/idea-board.module';

import { LocalStrategy } from '../common/guards/local.strategy';
import { JwtStrategy } from '../common/guards/jwt.strategy';
import { jwtConstants } from '../common/constants/general.constants';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
    UsersModule,
    EmailModule,
    IdeaBoardModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {
}
