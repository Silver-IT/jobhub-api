import { Column, Entity, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { SoftDelete } from '../../common/core/soft-delete';
import { ColumnNumericTransformer } from '../../common/utils/typeorm.util';
import { Milestone } from '../../project/entities/milestone.entity';

@Entity('payment_add_on')
export class PaymentAddOn extends SoftDelete {
  @ApiProperty({ type: () => Milestone })
  @ManyToOne(() => Milestone, milestone => milestone.paymentAddOns)
  milestone: Milestone;

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
  paidDate: Date;

  @ApiProperty()
  @Column()
  comment: string;
}
