import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';

export class PaginationDto {
  @ApiProperty({ required: false })
  @Optional()
  readonly skip?: number;

  @ApiProperty({ required: false })
  @Optional()
  readonly take?: number;
}
