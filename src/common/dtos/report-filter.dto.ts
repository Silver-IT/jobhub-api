import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';

import { TimeUnit } from '../enums/time.enum';

export class ReportFilterDto {

  @ApiProperty({enum: TimeUnit})
  @Optional()
  unit: TimeUnit

  @ApiProperty({required: false})
  @Optional()
  from?: string;

  @ApiProperty({required: false})
  @Optional()
  to: string;
}
