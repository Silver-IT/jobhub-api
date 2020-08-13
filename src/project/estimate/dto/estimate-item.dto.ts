import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsString } from 'class-validator';

import { MaterialType } from '../../../idea-board/enums';
import { ProjectAccessoryType, ProjectLocationType } from '../../enums';
import { CostUnit } from '../enums';

export class EstimateItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: ProjectAccessoryType, required: true })
  @IsEnum(ProjectAccessoryType)
  type: ProjectAccessoryType;

  @ApiProperty({ enum: MaterialType, isArray: true })
  @IsArray()
  materials: MaterialType[];

  @ApiProperty({ enum: ProjectLocationType })
  @IsEnum(ProjectLocationType)
  locationType: ProjectLocationType;

  @ApiProperty()
  @IsString()
  size: string;

  @ApiProperty()
  comment: string;

  @ApiProperty({ enum: CostUnit })
  @IsEnum(CostUnit)
  costUnit: CostUnit;

  @ApiProperty()
  pricePerUnit: number;
}
