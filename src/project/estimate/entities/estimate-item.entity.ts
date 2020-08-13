import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Estimate } from './estimate.entity';
import { MaterialType } from '../../../idea-board/enums';
import { ProjectAccessoryType, ProjectLocationType } from '../../enums';
import { ColumnNumericTransformer } from '../../../common/utils/typeorm.util';
import { CostUnit } from '../enums';

@Entity('estimate_item')
export class EstimateItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Estimate, estimate => estimate.items)
  estimate: Estimate;

  @ApiProperty({ enum: ProjectAccessoryType })
  @Column({ type: 'enum', enum: ProjectAccessoryType })
  type: ProjectAccessoryType;

  @ApiProperty({ enum: MaterialType, isArray: true })
  @Column({
    type: 'enum',
    enum: MaterialType,
    array: true,
    default: [],
  })
  materials: MaterialType[];

  @ApiProperty({ enum: ProjectLocationType })
  @Column({ type: 'enum', enum: ProjectLocationType })
  locationType: ProjectLocationType;

  @ApiProperty()
  @Column()
  size: string;

  @ApiProperty()
  @Column()
  comment: string;

  @ApiProperty({ enum: CostUnit })
  @Column({ type: 'enum', enum: CostUnit })
  costUnit: CostUnit;

  @ApiProperty()
  @Column('numeric', {
      precision: 17,
      scale: 2,
      transformer: new ColumnNumericTransformer(),
    },
  )
  pricePerUnit: number;
}
