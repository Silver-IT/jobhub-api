import { Module } from '@nestjs/common';

import { ProjectModule } from '../project/project.module';
import { NetworkContractorModule } from '../network-contractor/network-contractor.module';
import { UsersModule } from '../users/users.module';

import { SearchController } from './search.controller';

@Module({
  imports: [
    ProjectModule,
    UsersModule,
    NetworkContractorModule,
  ],
  controllers: [
    SearchController
  ]
})
export class SearchModule {}
