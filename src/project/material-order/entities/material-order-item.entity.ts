import { Column, Entity, ManyToOne } from 'typeorm';

import { SoftDelete } from '../../../common/core/soft-delete';
import { AmountType } from '../enums';
import { MaterialOrderGroup } from './material-order-group.entity';
import { MaterialOrderItemDto } from '../dtos/material-order-item.dto';

@Entity('material_order_item')
export class MaterialOrderItem extends SoftDelete {

  @ManyToOne(() => MaterialOrderGroup)
  group: MaterialOrderGroup;

  @Column()
  amount: string;

  @Column({ type: 'enum', enum: AmountType, nullable: true, default: undefined })
  amountType: AmountType;

  @Column()
  color: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  style: string;

  @Column({ nullable: true })
  requestDate: Date;

  @Column({ nullable: true })
  comment: string;

  toDto(): MaterialOrderItemDto {
    return {
      id: this.id,
      amount: this.amount,
      amountType: this.amountType,
      color: this.color,
      name: this.name,
      brand: this.brand,
      style: this.style,
      requestDate: this.requestDate,
      comment: this.comment,
    };
  }
}
