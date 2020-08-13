import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';

import {
  EstimateStatus,
  ProjectAccessoryType,
  ProjectLocationType,
  ProjectShapeType,
  ProjectTimelineType,
} from '../../enums';
import { EstimateItemDto } from './estimate-item.dto';
import { MaterialType } from '../../../idea-board/enums';
import { CostUnit } from '../enums';
import { ScheduleDto } from '../../../schedule/dtos/schedule.dto';

export class EstimateDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: ProjectAccessoryType })
  projectType: ProjectAccessoryType;

  @ApiProperty({ enum: MaterialType, isArray: true })
  materials: MaterialType[];

  @ApiProperty({ enum: ProjectLocationType })
  locationType: ProjectLocationType;

  @ApiProperty()
  groundState: string; // `What's currently there` field

  @ApiProperty()
  projectSize: string;

  @ApiProperty({ enum: ProjectShapeType })
  shapeType: ProjectShapeType;

  @ApiProperty()
  requestDetails: string;

  @ApiProperty()
  coreProjectComment: string;

  @ApiProperty({ enum: CostUnit })
  @IsEnum(CostUnit)
  costUnit: CostUnit;

  @ApiProperty()
  pricePerUnit: number;

  @ApiProperty({ type: () => EstimateItemDto, isArray: true, required: true })
  @IsArray()
  @ValidateNested({ each: true })
  items: EstimateItemDto[];

  @ApiProperty({ type: () => ScheduleDto, isArray: true, required: true })
  @IsArray()
  @ValidateNested({ each: true })
  siteVisitSchedules: ScheduleDto[];

  @ApiProperty({ enum: ProjectTimelineType, required: true })
  @IsEnum(ProjectTimelineType)
  timelineType: ProjectTimelineType;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  comment: string;

  @ApiProperty({ required: true })
  @IsUUID()
  contractorUserId: string;

  @ApiProperty({ enum: EstimateStatus, required: false })
  status?: EstimateStatus;
}
