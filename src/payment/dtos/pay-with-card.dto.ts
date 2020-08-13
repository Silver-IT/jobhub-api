import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class PayWithCardDto {
  @ApiProperty()
  @IsUUID()
  milestoneId: string;
}
