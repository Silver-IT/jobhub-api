import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AcceptEstimateDto {
  @ApiProperty()
  @IsUUID()
  scheduleId: string;
}
