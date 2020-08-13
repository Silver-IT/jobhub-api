import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsUrl } from 'class-validator';

import { ProjectAccessoryType } from '../../project/enums';
import { MaterialType } from '../enums';

export class UpdateIdeaBoardDto {
  @ApiProperty({ enum: ProjectAccessoryType })
  @IsEnum(ProjectAccessoryType)
  projectType: ProjectAccessoryType;

  @ApiProperty({ enum: MaterialType, isArray: true })
  @IsArray()
  materialTypes: MaterialType[];
}

export class CreateIdeaBoardDto extends UpdateIdeaBoardDto {
  @ApiProperty()
  @IsUrl()
  url: string;
}
