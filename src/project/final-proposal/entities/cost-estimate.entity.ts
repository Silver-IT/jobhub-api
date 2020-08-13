import { Column, Entity, ManyToOne } from 'typeorm';

import { SoftDelete } from '../../../common/core/soft-delete';
import { CostEstimateDto } from '../dtos/cost-estimate.dto';
import { FinalProposal } from './final-proposal.entity';
import { ProjectAccessoryType } from '../../enums';
import { ColumnNumericTransformer } from '../../../common/utils/typeorm.util';

@Entity('cost_estimate')
export class CostEstimate extends SoftDelete {
  @ManyToOne(() => FinalProposal, proposal => proposal.costEstimates)
  proposal: FinalProposal;

  @Column({ type: 'enum', enum: ProjectAccessoryType })
  type: ProjectAccessoryType;

  @Column()
  comment: string;

  @Column({ default: true })
  accept: boolean;

  @Column('numeric', {
      default: 0,
      precision: 17,
      scale: 2,
      transformer: new ColumnNumericTransformer(),
    },
  )
  cost: number;

  constructor(type?: ProjectAccessoryType, cost?: number, comment?: string, accept?: boolean) {
    super();
    this.type = type;
    this.cost = cost;
    this.comment = comment;
    this.accept = accept;
  }

  toDto(): CostEstimateDto {
    return {
      id: this.id,
      type: this.type,
      comment: this.comment,
      cost: this.cost,
      accept: this.accept,
    };
  }
}
