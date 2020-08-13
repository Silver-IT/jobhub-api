import { ApiProperty } from '@nestjs/swagger';

import { DateRangeDto } from '../../common/dtos/date-range.dto';
import { ScheduleType } from '../enums';

export class SearchScheduleDto extends DateRangeDto {
  @ApiProperty({ required: false })
  take?: number;

  @ApiProperty({ required: false })
  excludeConstructionSchedule?: boolean;

  @ApiProperty({ enum: ScheduleType, required: false })
  scheduleType?: ScheduleType;
}
