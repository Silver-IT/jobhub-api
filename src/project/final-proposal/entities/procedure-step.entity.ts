import { Column, Entity, ManyToOne } from 'typeorm';

import { ProjectProcedure } from './project-procedure.entity';
import { SoftDelete } from '../../../common/core/soft-delete';

@Entity('procedure_step')
export class ProcedureStep extends SoftDelete {
  @Column()
  title: string;

  @Column()
  comment: string;

  @ManyToOne(() => ProjectProcedure, procedure => procedure.steps)
  procedure: ProjectProcedure;

  constructor(title?: string, comment?: string) {
    super();
    this.title = title;
    this.comment = comment;
  }
}
