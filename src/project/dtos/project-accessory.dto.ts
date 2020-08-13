import { ApiProperty } from '@nestjs/swagger';
import { Entity } from 'typeorm';
import { IsUUID } from 'class-validator';

import { MaterialType } from '../../idea-board/enums';
import { ProjectAccessoryType, ProjectLocationType, ProjectShapeType } from '../enums';

@Entity('project_accessories')
export class ProjectAccessoryDto {

  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty({ enum: ProjectAccessoryType })
  type: ProjectAccessoryType;

  @ApiProperty({ enum: MaterialType, isArray: true })
  materials: MaterialType[];

  @ApiProperty({ enum: ProjectLocationType })
  locationType: ProjectLocationType;

  @ApiProperty()
  size: string;

  @ApiProperty({ enum: ProjectShapeType })
  shape: ProjectShapeType;

  @ApiProperty()
  groundState: string; // `What's currently there` field

  @ApiProperty()
  comment: string;
}
