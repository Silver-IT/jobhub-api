import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectModule } from '../project/project.module';
import { PageVisitHistory } from './entities/page-visit-history.entity';
import { MarketingController } from './marketing.controller';
import { MarketingService } from './marketing.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PageVisitHistory]),
    ProjectModule,
  ],
  controllers: [MarketingController],
  providers: [MarketingService]
})
export class MarketingModule {}
