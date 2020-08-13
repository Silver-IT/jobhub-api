import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module';
import { ProjectModule } from '../project/project.module';
import { AuthModule } from '../auth/auth.module';
import { IdeaBoardModule } from '../idea-board/idea-board.module';
import { NotificationModule } from '../notification/notification.module';
import { EmailModule } from '../email/email.module';
import { ContractModule } from '../contract/contract.module';
import { SlackModule } from '../slack/slack.module';
import { CustomerVisitHistoryModule } from '../customer-visit-history/customer-visit-history.module';
import { LeadModule } from '../lead/lead.module';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

@Module({
  imports: [
    AuthModule,
    ProjectModule,
    UsersModule,
    IdeaBoardModule,
    NotificationModule,
    ContractModule,
    EmailModule,
    SlackModule,
    CustomerVisitHistoryModule,
    LeadModule,
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {
}
