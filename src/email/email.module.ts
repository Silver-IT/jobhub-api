import { HttpModule, Module } from '@nestjs/common';
import { SendGridModule } from '@anchan828/nest-sendgrid';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

import { EmailService } from './email.service';
import { jwtConstants } from '../common/constants/general.constants';
import { EmailController } from './email.controller';
import { EmailLog } from './entities/email-status.entity';

@Module({
  imports: [
    HttpModule,
    SendGridModule.forRoot({
      apikey: process.env.SENDGRID_API_KEY || dotenv.config().parsed.SENDGRID_API_KEY,
    }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
    TypeOrmModule.forFeature([EmailLog]),
  ],
  providers: [EmailService],
  exports: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {
}
