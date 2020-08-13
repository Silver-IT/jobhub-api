import { ApiProperty } from '@nestjs/swagger';

import { PaginationDto } from '../../common/dtos/pagination.dto';
import { ProjectAccessoryType, ProjectStatusFilterType } from '../enums';
import { SortByDateType } from '../../common/enums/query.enum';

export class ProjectsPaginationDto extends PaginationDto {
  @ApiProperty({ required: false })
  contractorId: string;

  @ApiProperty({ enum: SortByDateType, required: false })
  projectSortByDate: SortByDateType;

  @ApiProperty({ enum: ProjectStatusFilterType, required: false })
  status: ProjectStatusFilterType;

  @ApiProperty({ enum: ProjectAccessoryType, required: false })
  projectType: ProjectAccessoryType;
}
