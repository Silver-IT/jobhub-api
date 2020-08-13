import { ApiProperty } from '@nestjs/swagger';

import { PaginationDto } from '../../../common/dtos/pagination.dto';

export class EstimateQueryDto extends PaginationDto {
  @ApiProperty({ required: false })
  from?: string;

  @ApiProperty({ required: false })
  to?: string;
}
