import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsString } from 'class-validator';

import { ProjectDto } from './register-project.dto';
import {
  CleanupRequiredType,
  DrainageType,
  MachineAccessType,
  OpinionType,
  PreferredPricePoint,
  PropertyGradeType,
  SoilType,
} from '../enums';
import { MaterialType } from '../../idea-board/enums';
import { ProjectAccessoryDto } from './project-accessory.dto';

export class UpdateProjectDto extends ProjectDto {
  // general details
  @ApiProperty({ enum: OpinionType })
  @IsEnum(OpinionType)
  interestedInFinancing: OpinionType;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  designRequired: boolean;

  @ApiProperty({ enum: CleanupRequiredType })
  cleanUpType: CleanupRequiredType;

  // project details
  @ApiProperty({ enum: MaterialType, isArray: true })
  @IsArray()
  materials: MaterialType[];

  @ApiProperty()
  @IsString()
  requestDetails: string;

  @ApiProperty()
  @IsString()
  comment: string;

  @ApiProperty()
  @IsString()
  manufacturer: string;

  @ApiProperty()
  @IsString()
  productName: string;

  @ApiProperty()
  @IsString()
  preferredSize: string;

  @ApiProperty()
  @IsString()
  preferredTexture: string;

  @ApiProperty({ enum: PreferredPricePoint })
  @IsEnum(PreferredPricePoint)
  preferredPricePoint: PreferredPricePoint;

  @ApiProperty()
  @IsString()
  additionalDesigns: string;

  // site details
  @ApiProperty({ enum: MachineAccessType })
  @IsEnum(MachineAccessType)
  machineAccess: MachineAccessType;

  @ApiProperty({ enum: PropertyGradeType })
  @IsEnum(PropertyGradeType)
  propertyGrade: PropertyGradeType;

  @ApiProperty({ enum: SoilType })
  @IsEnum(SoilType)
  soilType: SoilType;

  @ApiProperty({ enum: DrainageType })
  @IsEnum(DrainageType)
  drainageType: DrainageType;

  @ApiProperty()
  @IsString()
  exteriorUtilities: string;

  @ApiProperty()
  @IsString()
  exteriorHazards: string;

  @ApiProperty()
  @IsString()
  exteriorInconveniences: string;

  @ApiProperty()
  @IsString()
  materialStorage: string;

  @ApiProperty()
  @IsString()
  materialHaulOut: string;

  @ApiProperty()
  @IsString()
  downSpouts: string;

  @ApiProperty()
  @IsString()
  shrubRemoval: string;

  @ApiProperty({ type: [String] })
  attachments: string[];

  // Accessory details
  @ApiProperty({ type: () => ProjectAccessoryDto, isArray: true })
  accessories: ProjectAccessoryDto[];
}
