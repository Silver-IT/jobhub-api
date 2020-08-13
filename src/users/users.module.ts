import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IdeaBoardModule } from '../idea-board/idea-board.module';
import { EmailModule } from '../email/email.module';

import { User } from './entities/user.entity';
import { PasswordResetLink } from './entities/password-reset-link.entity';


import { UsersService } from './users.service';
import { CustomerProfile } from './entities/customer-profile.entity';
import { ContractorProfile } from './entities/contractor-profile.entity';
import { UsersController } from './users.controller';
import { PaymentService } from '../payment/payment.service';
import { PatioPackage } from './entities/patio-package.entity';
import { EmailChangeLink } from './entities/change-email-link.entity';

@Module({
  imports: [
    IdeaBoardModule,
    EmailModule,
    TypeOrmModule.forFeature([CustomerProfile, ContractorProfile, User, PasswordResetLink, PatioPackage, EmailChangeLink]),
  ],
  providers: [UsersService, PaymentService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {
}
