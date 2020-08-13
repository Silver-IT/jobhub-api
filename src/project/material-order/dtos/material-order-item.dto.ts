import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { SoftDeleteDto } from '../../../common/dtos/soft-delete.dto';
import { AmountType } from '../enums';

export class MaterialOrderItemDto extends SoftDeleteDto {

  @ApiProperty()
  amount: string;

  @ApiProperty({ enum: AmountType })
  @IsEnum(AmountType)
  amountType: AmountType;

  @ApiProperty()
  color: string;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  brand?: string;

  @ApiProperty({ required: false })
  style?: string;

  @ApiProperty({ required: false })
  requestDate?: Date;

  @ApiProperty({ required: false })
  comment?: string;

}
