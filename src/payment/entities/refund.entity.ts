import { Column, Entity, OneToOne } from 'typeorm';

import { Project } from '../../project/entities/project.entity';
import { SoftDelete } from '../../common/core/soft-delete';
import { ApiProperty } from '@nestjs/swagger';
import { ColumnNumericTransformer } from '../../common/utils/typeorm.util';

@Entity('refund')
export class Refund extends SoftDelete {
  @ApiProperty({ type: () => Project })
  @OneToOne(() => Project, project => project.refund)
  project: Project;

  @ApiProperty()
  @Column('numeric', {
      precision: 17,
      scale: 2,
      transformer: new ColumnNumericTransformer(),
    },
  )
  amount: number;

  @ApiProperty()
  @Column({ nullable: true, default: undefined })
  refundDate: Date;

  @ApiProperty()
  @Column()
  comment: string;
}
