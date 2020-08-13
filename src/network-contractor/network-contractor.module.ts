import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NetworkContractorService } from './network-contractor.service';
import { NetworkContractor } from './entities/network-contractor.entity';
import { NetworkContractorController } from './network-contractor.controller';
import { NetworkContractorCategory } from './entities/network-contractor-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([NetworkContractor, NetworkContractorCategory]),
  ],
  providers: [NetworkContractorService],
  controllers: [NetworkContractorController],
  exports: [NetworkContractorService],
})
export class NetworkContractorModule {
}
