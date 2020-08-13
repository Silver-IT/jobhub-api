import { ApiProperty } from '@nestjs/swagger';

export class ProjectsStatDto {
  @ApiProperty()
  inProgress: number;

  @ApiProperty()
  finalProposalPending: number;

  @ApiProperty()
  estimatePending: number;

  @ApiProperty()
  pendingSiteVisitSchedule: number;
}
