import { Module } from '@nestjs/common';

import { ContractorController } from './contractor.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [ContractorController],
})
export class ContractorModule {
}
