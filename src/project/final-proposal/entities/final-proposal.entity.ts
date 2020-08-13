import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

import { Project } from '../../entities/project.entity';
import { FinalProposalStatus } from '../enums';
import { DeclineReason } from '../../estimate/enums';
import { ColumnNumericTransformer } from '../../../common/utils/typeorm.util';
import { AccessoryLayout } from './accessory-layout.entity';
import { ProjectProcedure } from './project-procedure.entity';
import { CostEstimate } from './cost-estimate.entity';
import { ImageAttachment } from '../../entities/image-attachment.entity';
import { SoftDelete } from '../../../common/core/soft-delete';

@Entity('final_proposal')
export class FinalProposal extends SoftDelete {

  @Column()
  existingSiteAssessment: string;

  @Column()
  paversSize: string;

  @Column()
  paversColor: string;

  @Column()
  paversQuality: string;

  @OneToMany(() => AccessoryLayout, layout => layout.proposal)
  layouts: AccessoryLayout[];

  @Column()
  existingMaterialRemoval: string;

  @OneToMany(() => ProjectProcedure, procedure => procedure.proposal)
  procedures: ProjectProcedure[];

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  workPlan: string;

  @Column({ default: true })
  applyTax: boolean;

  @OneToMany(() => ImageAttachment, attachment => attachment.proposal)
  attachments: ImageAttachment[];


  @OneToMany(() => CostEstimate, estimate => estimate.proposal)
  costEstimates: CostEstimate[];

  @Column({ type: 'enum', enum: FinalProposalStatus, default: FinalProposalStatus.Pending })
  status: FinalProposalStatus;

  @Column({ type: 'enum', enum: DeclineReason, array: true, default: [] })
  declineReasons: DeclineReason[];

  @Column({ nullable: true, default: '' })
  declineComment: string;

  @OneToOne(() => Project, project => project.finalProposal)
  project: Project;

  @Column('numeric', {
      default: 0,
      precision: 17,
      scale: 2,
      transformer: new ColumnNumericTransformer(),
    },
  )
  discount: number;
}
