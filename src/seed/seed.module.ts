import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module';
import { JobsModule } from '../jobs/jobs.module';
import { IdeaBoardModule } from '../idea-board/idea-board.module';
import { ProjectModule } from '../project/project.module';

import { SeedService } from './seed.service';
import { NetworkContractorModule } from '../network-contractor/network-contractor.module';

@Module({
  providers: [
    SeedService,
  ],
  imports: [
    UsersModule,
    JobsModule,
    IdeaBoardModule,
    ProjectModule,
    NetworkContractorModule,
  ],
})
export class SeedModule {
}
