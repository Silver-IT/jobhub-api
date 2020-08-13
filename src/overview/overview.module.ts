import { Module } from '@nestjs/common';

import { ProjectModule } from '../project/project.module';
import { JobsModule } from '../jobs/jobs.module';

import { OverviewController } from './overview.controller';
import { PaymentService } from '../payment/payment.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ProjectModule,
    JobsModule,
    UsersModule
  ],
  providers: [PaymentService],
  controllers: [OverviewController],
})
export class OverviewModule {}
