import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

import { PageType } from '../../common/enums/page-type.enum';

export class AddPageVisitHistoryDto {
  @ApiProperty({ type: 'enum', enum: PageType, required: true })
  @IsEnum(PageType)
  page: PageType;

  @ApiProperty()
  @IsUUID()
  projectId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly id?: string;
}
