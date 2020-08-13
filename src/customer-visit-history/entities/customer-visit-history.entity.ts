import { Column, Entity, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { SoftDelete } from '../../common/core/soft-delete';
import { PageType } from '../../common/enums/page-type.enum';
import { Project } from '../../project/entities/project.entity';

@Entity('customer_visit_history')
export class CustomerVisitHistory extends SoftDelete {

  @ApiProperty({ type: 'enum', enum: PageType })
  @Column({ type: 'enum', enum: PageType })
  page: PageType;

  @ApiProperty({ type: () => Project })
  @ManyToOne(() => Project, project => project.customerVisitHistory)
  project: Project;

  constructor(page?: PageType, project?: Project) {
    super();
    this.page = page;
    this.project = project;
  }
}
