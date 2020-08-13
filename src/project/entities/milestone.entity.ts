import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Project } from './project.entity';
import { ColumnNumericTransformer } from '../../common/utils/typeorm.util';
import { SoftDelete } from '../../common/core/soft-delete';
import { MilestoneStatus } from '../enums';
import { PaymentMethod } from '../../payment/enums';
import { PaymentAddOn } from '../../payment/entities/payment-add-on.entity';

@Entity('milestone')
export class Milestone extends SoftDelete {
  @ApiProperty({ type: () => Project })
  @ManyToOne(() => Project, project => project.milestones)
  project: Project;

  @ApiProperty({ enum: PaymentMethod })
  @Column({ type: 'enum', enum: PaymentMethod, nullable: true, default: undefined })
  paymentMethod: PaymentMethod;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  order: number;

  @ApiProperty()
  @Column('numeric', {
      precision: 17,
      scale: 2,
      transformer: new ColumnNumericTransformer(),
    },
  )
  amount: number;

  @ApiProperty()
  @Column()
  comment: string;

  @ApiProperty()
  @Column({ nullable: true, default: undefined })
  paidDate: Date;

  @ApiProperty()
  @Column({ nullable: true, default: undefined })
  paymentId: string;

  @ApiProperty()
  @Column({ nullable: true, default: false })
  payWithCash: boolean;

  @OneToMany(() => PaymentAddOn, addOn => addOn.milestone)
  paymentAddOns: PaymentAddOn[];

  @ApiProperty({ type: 'enum', enum: MilestoneStatus })
  @Column({ type: 'enum', enum: MilestoneStatus, default: MilestoneStatus.Pending })
  status: MilestoneStatus;

  @ApiProperty({ type: () => Milestone })
  hold: Milestone;
}
