import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class SkipEstimateDto {
  @ApiProperty()
  @IsUUID()
  contractorUserId: string;

  @ApiProperty({ type: Date, required: true })
  siteVisitDateFrom: Date;

  @ApiProperty({ type: Date, required: true })
  siteVisitDateTo: Date;
}
