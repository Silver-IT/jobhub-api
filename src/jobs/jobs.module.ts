import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SlackModule } from '../slack/slack.module';

import { Applicant } from './entities/applicant.entity';
import { Job } from './entities/job.entity';

import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job, Applicant]),
    SlackModule,
  ],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [
    JobsService
  ]
})
export class JobsModule {}
