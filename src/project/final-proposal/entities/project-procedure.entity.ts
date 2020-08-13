import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { ProjectAccessoryType } from '../../enums';
import { ProcedureStep } from './procedure-step.entity';
import { FinalProposal } from './final-proposal.entity';
import { SoftDelete } from '../../../common/core/soft-delete';

@Entity('project_procedure')
export class ProjectProcedure extends SoftDelete {
  @Column({ type: 'enum', enum: ProjectAccessoryType })
  type: ProjectAccessoryType;

  @OneToMany(() => ProcedureStep, step => step.procedure)
  steps: ProcedureStep[];

  @ManyToOne(() => FinalProposal, proposal => proposal.procedures)
  proposal: FinalProposal;

  constructor(type?: ProjectAccessoryType, steps?: ProcedureStep[]) {
    super();
    this.type = type;
    this.steps = steps;
  }
}
