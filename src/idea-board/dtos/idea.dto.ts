import { ApiProperty } from '@nestjs/swagger';

import { ProjectAccessoryType } from '../../project/enums';
import { MaterialType } from '../enums';

export class IdeaDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  width: number;

  @ApiProperty()
  height: number;

  @ApiProperty({ type: Boolean, default: false })
  selected?: boolean;

  @ApiProperty({ enum: ProjectAccessoryType })
  projectType: ProjectAccessoryType;

  @ApiProperty({ enum: MaterialType, isArray: true })
  materialTypes: MaterialType[];
}
