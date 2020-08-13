import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';
import { NotificationModule } from '../notification/notification.module';
import { CustomerVisitHistoryModule } from '../customer-visit-history/customer-visit-history.module';
import { IdeaBoardModule } from '../idea-board/idea-board.module';
import { EmailModule } from '../email/email.module';
import { TagModule } from '../tag/tag.module';
import { LeadModule } from '../lead/lead.module';

import { ProjectController } from './project.controller';
import { EstimateController } from './estimate/estimate.controller';
import { FinalProposalController } from './final-proposal/final-proposal.controller';
import { Milestone } from './entities/milestone.entity';
import { PaymentAddOn } from '../payment/entities/payment-add-on.entity';
import { Refund } from '../payment/entities/refund.entity';
import { AccessoryLayout } from './final-proposal/entities/accessory-layout.entity';
import { ProcedureStep } from './final-proposal/entities/procedure-step.entity';
import { ProjectProcedure } from './final-proposal/entities/project-procedure.entity';
import { CostEstimate } from './final-proposal/entities/cost-estimate.entity';
import { Schedule } from '../schedule/entities/schedule.entity';
import { Project } from './entities/project.entity';
import { ImageAttachment } from './entities/image-attachment.entity';
import { ProjectAccessory } from './entities/project-accessory.entity';
import { Estimate } from './estimate/entities/estimate.entity';
import { EstimateItem } from './estimate/entities/estimate-item.entity';
import { FinalProposal } from './final-proposal/entities/final-proposal.entity';
import { MaterialRequest } from './material-request/entities/material-request.entity';
import { MaterialRequestController } from './material-request/material-request.controller';
import { ProjectService } from './project.service';
import { ScheduleService } from '../schedule/schedule.service';
import { EstimateService } from './estimate/estimate.service';
import { FinalProposalService } from './final-proposal/final-proposal.service';
import { MaterialRequestService } from './material-request/material-request.service';
import { MaterialOrderController } from './material-order/material-order.controller';
import { MaterialOrderService } from './material-order/material-order.service';
import { MaterialOrderGroup } from './material-order/entities/material-order-group.entity';
import { MaterialOrderItem } from './material-order/entities/material-order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ImageAttachment,
      Project,
      ProjectAccessory,
      Estimate,
      EstimateItem,
      FinalProposal,
      Schedule,
      AccessoryLayout,
      ProcedureStep,
      ProjectProcedure,
      CostEstimate,
      Milestone,
      PaymentAddOn,
      Refund,
      MaterialRequest,
      MaterialOrderGroup,
      MaterialOrderItem,
    ]),
    UsersModule,
    IdeaBoardModule,
    NotificationModule,
    EmailModule,
    TagModule,
    CustomerVisitHistoryModule,
    LeadModule,
  ],
  controllers: [
    ProjectController,
    EstimateController,
    FinalProposalController,
    MaterialRequestController,
    MaterialOrderController,
  ],
  providers: [
    ProjectService,
    EstimateService,
    FinalProposalService,
    ScheduleService,
    MaterialRequestService,
    MaterialOrderService,
  ],
  exports: [
    ProjectService,
    EstimateService,
    FinalProposalService,
  ],
})
export class ProjectModule {
}
