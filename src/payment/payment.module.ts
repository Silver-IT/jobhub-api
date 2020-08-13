import { Module } from '@nestjs/common';

import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { ProjectModule } from '../project/project.module';
import { NotificationModule } from '../notification/notification.module';
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../email/email.module';

@Module({
  providers: [PaymentService],
  controllers: [PaymentController],
  imports: [ProjectModule, NotificationModule, UsersModule, EmailModule],
})
export class PaymentModule {
}
