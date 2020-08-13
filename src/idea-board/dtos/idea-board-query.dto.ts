import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';

import { PaginationDto } from '../../common/dtos/pagination.dto';
import { ProjectAccessoryType } from '../../project/enums';
import { MaterialType } from '../enums';

export class IdeaBoardQueryDto extends PaginationDto {
  @ApiProperty({ enum: ProjectAccessoryType, required: false })
  @Optional()
  projectType?: ProjectAccessoryType;

  @ApiProperty({ enum: MaterialType, required: false })
  @Optional()
  materialType?: MaterialType;
}

export class AllIdeaBoardQueryDto {
  @ApiProperty({ enum: ProjectAccessoryType, required: false })
  @Optional()
  projectType?: ProjectAccessoryType;

  @ApiProperty({ enum: MaterialType, required: false })
  @Optional()
  materialType?: MaterialType;
}
