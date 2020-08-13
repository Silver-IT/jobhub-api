import { ApiProperty } from '@nestjs/swagger';

export class OverallStatsDto {

  @ApiProperty()
  applicants: number;

  @ApiProperty()
  customers: number;

  @ApiProperty()
  estimates: number;

  @ApiProperty()
  projects: number;

  @ApiProperty()
  ytd: number;
}
