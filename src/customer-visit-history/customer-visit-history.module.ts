import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomerVisitHistoryService } from './customer-visit-history.service';
import { CustomerVisitHistory } from './entities/customer-visit-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerVisitHistory])
  ],
  providers: [
    CustomerVisitHistoryService
  ],
  exports: [
    CustomerVisitHistoryService
  ]
})
export class CustomerVisitHistoryModule {}
