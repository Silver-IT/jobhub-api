import { ApiProperty } from '@nestjs/swagger';

import { PaginationDto } from '../../common/dtos/pagination.dto';
import { ArchivedType, SortByDateType } from '../../common/enums/query.enum';

export class QueryLeadsDto extends PaginationDto {
  @ApiProperty({ enum: SortByDateType, required: false })
  sortByDate?: SortByDateType;

  @ApiProperty({ enum: ArchivedType, required: false })
  archivedType?: ArchivedType;
}
