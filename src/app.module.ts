import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SeedModule } from './seed/seed.module';
import { ContactUsModule } from './contact-us/contact-us.module';
import { SlackModule } from './slack/slack.module';
import { EmailModule } from './email/email.module';
import { JobsModule } from './jobs/jobs.module';
import { UploadModule } from './upload/upload.module';
import { ProjectModule } from './project/project.module';
import { IdeaBoardModule } from './idea-board/idea-board.module';
import { CustomerModule } from './customer/customer.module';
import { NetworkContractorModule } from './network-contractor/network-contractor.module';
import { SocketModule } from './socket/socket.module';
import { EventModule } from './event/event.module';
import { NotificationModule } from './notification/notification.module';
import { ScheduleModule } from './schedule/schedule.module';
import { PaymentModule } from './payment/payment.module';
import { ChatModule } from './chat/chat.module';
import { ContractorModule } from './contractor/contractor.module';
import { OverviewModule } from './overview/overview.module';
import { SearchModule } from './search/search.module';
import { GoogleModule } from './google/google.module';
import { ContractModule } from './contract/contract.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { TagModule } from './tag/tag.module';
import { LogRocketModule } from './log-rocket/log-rocket.module';
import { MarketingModule } from './marketing/marketing.module';
import { CustomerVisitHistoryModule } from './customer-visit-history/customer-visit-history.module';
import { LeadModule } from './lead/lead.module';
import * as ormconfig from './ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    UsersModule,
    AuthModule,
    SeedModule,
    LeadModule,
    SlackModule,
    EmailModule,
    SlackModule,
    JobsModule,
    UploadModule,
    ProjectModule,
    IdeaBoardModule,
    CustomerModule,
    ContactUsModule,
    NetworkContractorModule,
    SocketModule,
    EventModule,
    NotificationModule,
    ScheduleModule,
    PaymentModule,
    ChatModule,
    ContractorModule,
    OverviewModule,
    SearchModule,
    GoogleModule,
    ContractModule,
    PortfolioModule,
    TagModule,
    LogRocketModule,
    MarketingModule,
    CustomerVisitHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
