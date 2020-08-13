import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';

export class DateRangeDto {
  @ApiProperty({ required: false })
  @Optional()
  readonly from?: string;

  @ApiProperty({ required: false })
  @Optional()
  readonly to?: string;
}
