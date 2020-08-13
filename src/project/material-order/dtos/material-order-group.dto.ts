import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { SoftDeleteDto } from '../../../common/dtos/soft-delete.dto';
import { ProjectAccessoryType } from '../../enums';
import { MaterialOrderGroupType } from '../enums';
import { MaterialOrderItemDto } from './material-order-item.dto';

export class MaterialOrderGroupDto extends SoftDeleteDto {
  @ApiProperty({ type: () => MaterialOrderItemDto, isArray: true })
  @Type(() => MaterialOrderItemDto)
  @ValidateNested({ each: true })
  items: MaterialOrderItemDto[];

  @ApiProperty({ enum: ProjectAccessoryType, required: false })
  layoutType?: ProjectAccessoryType;

  @ApiProperty({ enum: MaterialOrderGroupType })
  @IsEnum(MaterialOrderGroupType)
  groupType: MaterialOrderGroupType;
}
