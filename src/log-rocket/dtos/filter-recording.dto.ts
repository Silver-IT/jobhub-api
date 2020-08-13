import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';

import { PaginationDto } from '../../common/dtos/pagination.dto';

export class FilterRecordingDto extends PaginationDto {

  @ApiProperty({ required: false, type: Boolean })
  @Optional()
  readonly resolved?: boolean | string;

  @ApiProperty({ required: false, type: Boolean })
  @Optional()
  readonly authorized?: boolean | string;

  @ApiProperty({ required: false })
  @Optional()
  readonly from?: string;

  @ApiProperty({ required: false })
  @Optional()
  readonly to?: string;

  @ApiProperty({ required: false })
  @Optional()
  readonly email?: string;

}
