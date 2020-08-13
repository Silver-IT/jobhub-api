import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';

import { ProjectAccessoryType, ProjectLocationType, ProjectShapeType } from '../enums';
import { MaterialType } from '../../idea-board/enums';
import { Project } from './project.entity';
import { SoftDelete } from '../../common/core/soft-delete';

@Entity('project_accessory')
export class ProjectAccessory extends SoftDelete {

  @ManyToOne(() => Project, project => project.accessories)
  project: Project;

  @ApiProperty({ enum: ProjectAccessoryType })
  @Column({ enum: ProjectAccessoryType })
  type: ProjectAccessoryType;

  @ApiProperty({ enum: MaterialType, isArray: true })
  @Column({ type: 'enum', enum: MaterialType, array: true, default: [] })
  materials: MaterialType[];

  @ApiProperty({ enum: ProjectLocationType })
  @Column({ type: 'enum', enum: ProjectLocationType, nullable: true, default: undefined })
  locationType: ProjectLocationType;

  @ApiProperty()
  @Column({ default: '' })
  size: string;

  @ApiProperty({ enum: ProjectShapeType })
  @Column({ type: 'enum', enum: ProjectShapeType, nullable: true, default: undefined })
  shape: ProjectShapeType;

  @ApiProperty()
  @Column({ default: '' })
  groundState: string; // `What's currently there` field

  @ApiProperty()
  @Column({ default: '' })
  comment: string;
}
