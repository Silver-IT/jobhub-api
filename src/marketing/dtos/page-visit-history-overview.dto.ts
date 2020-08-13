import { ApiProperty } from '@nestjs/swagger';

import { PageType } from '../../common/enums/page-type.enum';

export class PageVisitHistoryOverviewDto {

  @ApiProperty({ enum: PageType })
  page: PageType;

  @ApiProperty()
  sub: string;

  @ApiProperty()
  count: number;
}
