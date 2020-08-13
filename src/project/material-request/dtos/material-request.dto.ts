import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { ProjectAccessoryType } from '../../enums';
import { SoftDeleteDto } from '../../../common/dtos/soft-delete.dto';

export class MaterialRequestDto extends SoftDeleteDto {
  @ApiProperty({ enum: ProjectAccessoryType })
  @IsEnum(ProjectAccessoryType)
  type: ProjectAccessoryType;

  @ApiProperty({ type: String, isArray: true })
  notes: string[];
}
