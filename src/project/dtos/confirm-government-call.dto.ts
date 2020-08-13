import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ConfirmGovernmentCallDto {
  @ApiProperty({ required: false })
  @IsOptional()
  comment?: string;
}
