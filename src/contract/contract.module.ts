import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ContractService } from './contract.service';
import { AccessoryLayout } from '../project/final-proposal/entities/accessory-layout.entity';
import { CostEstimate } from '../project/final-proposal/entities/cost-estimate.entity';
import { ContractController } from './contract.controller';
import { ProjectModule } from '../project/project.module';
import { UsersModule } from '../users/users.module';
import { ImageAttachment } from '../project/entities/image-attachment.entity';
import { NotificationModule } from '../notification/notification.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessoryLayout, CostEstimate, ImageAttachment]),
    ProjectModule,
    UsersModule,
    NotificationModule,
    EmailModule,
  ],
  providers: [ContractService],
  controllers: [ContractController],
  exports: [ContractService],
})
export class ContractModule {
}
