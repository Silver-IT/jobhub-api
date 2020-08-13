import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';

export class TagQueryDto {

  @ApiProperty({ required: false })
  @Optional()
  keyword?: string;

  @ApiProperty({ required: false })
  @Optional()
  count?: number;
}
