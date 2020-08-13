import { ApiProperty } from '@nestjs/swagger';

import { ScheduleType } from '../enums';

export class AddScheduleDto {
  @ApiProperty()
  type: ScheduleType;

  @ApiProperty()
  from: Date;

  @ApiProperty()
  to: Date;
}
