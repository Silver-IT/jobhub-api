import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { MaterialRequestDto } from './material-request.dto';
import { SoftDeleteDto } from '../../../common/dtos/soft-delete.dto';

export class ProjectMaterialDto extends SoftDeleteDto {
  @ApiProperty({ type: [MaterialRequestDto], isArray: true })
  @ValidateNested({ each: true })
  @Type(() => MaterialRequestDto)
  accessoryMaterials: MaterialRequestDto[];
}
