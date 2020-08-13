import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class RescheduleSiteVisitDto {
  @ApiProperty()
  @IsUUID()
  scheduleId: string;
}
