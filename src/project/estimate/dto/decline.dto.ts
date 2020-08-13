import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

import { DeclineReason } from '../enums';

export class DeclineDto {
  @ApiProperty({ enum: DeclineReason, isArray: true })
  @IsArray()
  declineReasons: DeclineReason[];

  @ApiProperty({ required: false })
  declineComment: string;
}
