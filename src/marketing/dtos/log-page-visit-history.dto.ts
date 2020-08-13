import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { PageType } from '../../common/enums/page-type.enum';

export class LogPageVisitHistoryDto {

  @ApiProperty({ enum: PageType })
  @IsEnum(PageType)
  readonly page: PageType;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly sub?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly id?: string;
}
