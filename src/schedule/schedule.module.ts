import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ScheduleController } from './schedule.controller';
import { ProjectModule } from '../project/project.module';
import { GoogleModule } from '../google/google.module';
import { NotificationModule } from '../notification/notification.module';
import { EmailModule } from '../email/email.module';
import { UsersModule } from '../users/users.module';
import { ScheduleService } from './schedule.service';
import { Schedule } from './entities/schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Schedule]),
    ProjectModule,
    GoogleModule,
    NotificationModule,
    EmailModule,
    UsersModule,
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {
}
