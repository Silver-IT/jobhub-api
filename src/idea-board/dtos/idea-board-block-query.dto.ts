import { ApiProperty } from '@nestjs/swagger';

import { ProjectAccessoryType } from '../../project/enums';

export class IdeaBoardBlockQueryDto {
  @ApiProperty({ type: 'enum', enum: ProjectAccessoryType, required: false })
  projectType?: ProjectAccessoryType;

  @ApiProperty()
  count: number;
}
