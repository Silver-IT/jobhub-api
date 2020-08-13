import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import {
  DrainageType,
  MachineAccessType,
  ProjectAccessoryType,
  ProjectLocationType,
  ProjectShapeType,
  ProjectTimelineType,
  PropertyGradeType,
  SoilType,
} from '../enums';
import { Lead } from '../../lead/entities/lead.entity';

export class ProjectDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ required: false })
  latitude?: number;

  @ApiProperty({ required: false })
  longitude?: number;

  @ApiProperty({ enum: ProjectAccessoryType })
  @IsEnum(ProjectAccessoryType)
  projectType: ProjectAccessoryType;

  @ApiProperty({ enum: ProjectLocationType })
  @IsEnum(ProjectLocationType)
  locationType: ProjectLocationType;

  @ApiProperty()
  @IsString()
  projectSize: string;

  @ApiProperty({ enum: ProjectShapeType })
  @IsEnum(ProjectShapeType)
  shapeType: ProjectShapeType;

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

  @ApiProperty({ enum: ProjectTimelineType })
  @IsEnum(ProjectTimelineType)
  timelineType: ProjectTimelineType;

  @ApiProperty({ required: false })
  budget?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  comment?: string;
}

export class RegisterProjectDto extends ProjectDto {
  @ApiProperty({ enum: ProjectAccessoryType, isArray: true })
  accessories: ProjectAccessoryType[];

  @ApiProperty({ type: [String] })
  attachments: string[];

  static fromLead(lead: Lead) {
    const dto = new RegisterProjectDto();
    dto.name = '';
    dto.attachments = [];
    dto.accessories = [];
    dto.projectType = ProjectAccessoryType.Other;
    dto.locationType = ProjectLocationType.Other;
    dto.timelineType = ProjectTimelineType.MoreThan6Months;
    dto.machineAccess = MachineAccessType.NotSure;
    dto.propertyGrade = PropertyGradeType.WellOutOfLevel;
    dto.soilType = SoilType.TopSoil;
    dto.drainageType = DrainageType.Dry;
    dto.address = lead.address;
    dto.latitude = lead.latitude;
    dto.longitude = lead.longitude;
    return dto;
  }
}

export class RegisterProjectWithCustomerDto {
  @ApiProperty({ type: () => RegisterProjectDto })
  @Type(() => RegisterProjectDto)
  @ValidateNested({ each: true })
  project: RegisterProjectDto;

  @ApiProperty()
  @IsUUID()
  customerId: string;
}

export class RegisterProjectWithIdeasDto {
  @ApiProperty({ type: RegisterProjectDto, isArray: true })
  @Type(() => RegisterProjectDto)
  @ValidateNested({ each: true })
  projects: RegisterProjectDto[];

  @ApiProperty({ type: String, isArray: true })
  @IsArray()
  ideas: string[];
}
