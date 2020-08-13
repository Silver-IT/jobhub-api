import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Project } from '../../entities/project.entity';
import { EstimateItem } from './estimate-item.entity';
import { SoftDelete } from '../../../common/core/soft-delete';
import {
  EstimateStatus,
  ProjectAccessoryType,
  ProjectLocationType,
  ProjectShapeType,
  ProjectTimelineType,
} from '../../enums';
import { DeclineReason, CostUnit } from '../enums';
import { MaterialType } from '../../../idea-board/enums';
import { ColumnNumericTransformer } from '../../../common/utils/typeorm.util';
import { ImageAttachment } from '../../entities/image-attachment.entity';
import { Schedule } from '../../../schedule/entities/schedule.entity';

@Entity('estimate')
export class Estimate extends SoftDelete {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Project, project => project.estimate)
  project: Project;


  @ApiProperty({ enum: ProjectAccessoryType })
  @Column({ type: 'enum', enum: ProjectAccessoryType })
  projectType: ProjectAccessoryType;

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
  @Column({ default: '' })
  groundState: string; // `What's currently there` field

  @ApiProperty()
  @Column({ default: '' })
  projectSize: string;

  @ApiProperty({ enum: ProjectShapeType })
  @Column({ type: 'enum', enum: ProjectShapeType, nullable: true, default: undefined })
  shapeType: ProjectShapeType;

  @ApiProperty()
  @Column({ default: '' })
  requestDetails: string;

  @ApiProperty()
  @Column({ default: '' })
  coreProjectComment: string;

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

  @ApiProperty({ type: () => EstimateItem, isArray: true })
  @OneToMany(() => EstimateItem, item => item.estimate)
  items: EstimateItem[];

  @ApiProperty({ type: () => Schedule, isArray: true })
  @OneToMany(() => Schedule, schedule => schedule.estimate)
  siteVisitSchedules: Schedule[];

  @ApiProperty({ enum: ProjectTimelineType })
  @Column({ type: 'enum', enum: ProjectTimelineType })
  timelineType: ProjectTimelineType;

  @ApiProperty()
  @Column()
  comment: string;

  @ApiProperty({ type: () => ImageAttachment, isArray: true })
  @OneToMany(() => ImageAttachment, attachment => attachment.estimate)
  sketches: ImageAttachment[];


  @ApiProperty({ enum: EstimateStatus })
  @Column({ type: 'enum', enum: EstimateStatus, default: EstimateStatus.Pending })
  status: EstimateStatus;

  @ApiProperty({ enum: DeclineReason, isArray: true })
  @Column({ type: 'enum', enum: DeclineReason, array: true, default: [] })
  declineReasons: DeclineReason[];

  @ApiProperty()
  @Column({ nullable: true, default: '' })
  declineComment: string;

}
