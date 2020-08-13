import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { PageType } from '../../common/enums/page-type.enum';

@Entity('page_visit_history')
export class PageVisitHistory extends SoftDelete {

  @ApiProperty({ type: 'enum', enum: PageType })
  @Column({ type: 'enum', enum: PageType })
  page: PageType;

  @ApiProperty({ required: false })
  @Column({ default: null })
  sub: string;
}
