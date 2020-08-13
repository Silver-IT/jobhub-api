import { ApiProperty } from '@nestjs/swagger';

import { ProjectAccessoryType } from '../../enums';

export class CostEstimateDto {
  @ApiProperty({ required: false })
  id?: string;

  @ApiProperty({ enum: ProjectAccessoryType })
  type: ProjectAccessoryType;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  cost: number;

  @ApiProperty()
  accept: boolean;
}
